#!/usr/bin/env python3
"""Check the public bundle and its real resources, forms, CSP and SEO metadata."""
import argparse,base64,hashlib,json,re
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote,urlsplit
from xml.etree import ElementTree as ET
from PIL import Image
class Page(HTMLParser):
    def __init__(self):
        super().__init__();self.ids=[];self.refs=[];self.csp=[];self.canon=[];self.h1=0;self.forms=[];self.scripts=[];self.errors=[]
    def handle_starttag(self,tag,attrs):
        a=dict(attrs)
        if 'id' in a:self.ids.append(a['id'])
        for key in ('src','href'):
            if key in a:self.refs.append(a[key])
        if tag=='h1':self.h1+=1
        if tag=='meta' and a.get('http-equiv')=='Content-Security-Policy':self.csp.append(a['content'])
        if tag=='link' and a.get('rel')=='canonical':self.canon.append(a['href'])
        if tag=='form':self.forms.append(a)
        if tag=='script':self.scripts.append(a)
        if any(k.lower().startswith('on') for k in a):self.errors.append('inline event handler')
def check(root,base):
    root=Path(root);base=base.rstrip('/')+'/';base_path=urlsplit(base).path
    parsed={};errors=[];references=0
    for file in sorted(root.glob('*.html')):
        text=file.read_text();p=Page();p.feed(text);parsed[file.name]=p
        if len(p.csp)!=1 or len(p.canon)!=1:errors.append(file.name+': CSP/canonical missing or duplicated')
        if p.h1!=1:errors.append(file.name+': expected one h1')
        if any(count>1 for count in Counter(p.ids).values()):errors.append(file.name+': duplicated IDs')
        errors.extend(file.name+': '+e for e in p.errors)
        canonical=base+('' if file.name=='index.html' else file.name)
        if p.canon!=[canonical]:errors.append(file.name+': wrong canonical '+str(p.canon))
        for data in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):
            json.loads(data);digest=base64.b64encode(hashlib.sha256(data.encode()).digest()).decode()
            if 'sha256-'+digest not in p.csp[0]:errors.append(file.name+': JSON-LD CSP hash mismatch')
        if any(not s.get('src') and s.get('type')!='application/ld+json' for s in p.scripts):errors.append(file.name+': executable inline script')
        for form in p.forms:
            if form.get('method','').lower()!='post' or form.get('action')!='https://formsubmit.co/info@abruzzofoto.it':errors.append(file.name+': unexpected form target')
            if f'name="_next" value="{base}grazie.html"' not in text:errors.append(file.name+': wrong form callback')
        if 'http://' in re.sub(r'"@context":"http[^\"]+"','',text) and 'http://www.w3.org/' not in text:errors.append(file.name+': insecure URL')
    for name,p in parsed.items():
        for ref in p.refs:
            u=urlsplit(ref)
            if u.scheme or u.netloc:continue
            path=unquote(u.path)
            if path.startswith('/'):
                if not path.startswith(base_path):errors.append(name+': wrong root path '+path);continue
                path=path[len(base_path):]
            target=root/name if not u.path else root/path
            if target.is_dir():target=target/'index.html'
            references+=1
            if not target.exists():errors.append(name+': missing '+ref);continue
            if u.fragment and target.suffix=='.html' and u.fragment not in parsed.get(target.name,Page()).ids:errors.append(name+': missing anchor '+ref)
    for css in root.glob('*.css'):
        for ref in re.findall(r'url\([\"\']?([^\)\"\']+)',css.read_text()):
            if not ref.startswith(('data:','http:','https:')) and not (root/urlsplit(ref).path).exists():errors.append(css.name+': missing '+ref)
    photo_names=re.findall(r"file:'([^']+)'",(root/'app.js').read_text())
    if len(photo_names)!=26 or len(set(photo_names))!=26:errors.append('Expected 26 unique portfolio images')
    for photo in photo_names:
        with Image.open(root/'assets'/photo) as img:img.verify()
    for item in ET.parse(root/'sitemap.xml').findall('{*}url/{*}loc'):
        if not item.text.startswith(base):errors.append('wrong sitemap origin')
        else:
            target=root/item.text.removeprefix(base)
            if target.is_dir():target=target/'index.html'
            if not target.exists():errors.append('missing sitemap page '+item.text)
    if (root/'web.config').exists():ET.parse(root/'web.config')
    result={'root':str(root),'pages':len(parsed),'references_checked':references,'photos_verified':len(photo_names),'forms':sum(len(p.forms) for p in parsed.values()),'errors':errors}
    print(json.dumps(result,indent=2,ensure_ascii=False));return result
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('root');parser.add_argument('--base',default='https://xx1805xx.github.io/abruzzofoto/');args=parser.parse_args();raise SystemExit(bool(check(args.root,args.base)['errors']))
