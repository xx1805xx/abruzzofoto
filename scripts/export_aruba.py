#!/usr/bin/env python3
"""Export the public portfolio for Aruba Windows/IIS without changing GitHub Pages."""
import argparse, base64, hashlib, html, json, re, shutil, zipfile
from pathlib import Path
from urllib.parse import urlsplit
from xml.etree import ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]
OLD='https://xx1805xx.github.io/abruzzofoto/'
def export(base, output):
    parsed=urlsplit(base)
    if parsed.scheme!='https' or not re.fullmatch(r'[a-zA-Z0-9.-]+',parsed.netloc) or parsed.path not in ('','/') or parsed.query or parsed.fragment:
        raise ValueError('Use an HTTPS domain without a subdirectory, query or fragment')
    base=base.rstrip('/')+'/'
    output=output.resolve()
    if output==ROOT or ROOT in output.parents and output.parts[len(ROOT.parts)] in ('docs','scripts','tests','deployment','.git'):
        raise ValueError('The output must not overwrite source files')
    output.mkdir(parents=True,exist_ok=True)
    if any(output.iterdir()):
        raise ValueError('The export destination must be empty')
    shutil.copytree(ROOT/'docs',output,dirs_exist_ok=True)
    hashes=set()
    for page in output.glob('*.html'):
        text=page.read_text().replace(OLD,base)
        if page.name=='404.html':text=text.replace('/abruzzofoto/','/')
        # The GitHub URL-prefix verification is not proof of ownership of this domain.
        text=re.sub(r'<meta name="google-site-verification"[^>]*>','',text)
        # Remove the old-site shortcut before its target becomes a permanent redirect.
        text=re.sub(r'<a href="https://www\.abruzzofoto\.it/_/Home\.html"[^>]*>SITO ORIGINALE →</a>','',text)
        if page.name=='privacy.html':
            text=text.replace('12 NOVEMBRE 2026','16 NOVEMBRE 2026')
            text=re.sub(r'<p>Il sito è ospitato su GitHub Pages\..*?</p>', '<p>Il sito è ospitato sui servizi Aruba. Il fornitore può trattare dati tecnici di accesso per erogare e proteggere il servizio, secondo la propria <a href="https://www.aruba.it/informativa_arubaspa.pdf" target="_blank" rel="noopener noreferrer">informativa privacy</a>. Immagini, caratteri e codice sono serviti dal sito. I collegamenti esterni portano a servizi con informative proprie e non vengono incorporati automaticamente.</p>',text)
        for data in re.findall(r'<script type="application/ld\+json">(.*?)</script>',text,re.S):
            digest=base64.b64encode(hashlib.sha256(data.encode()).digest()).decode()
            hashes.add(digest)
            text=re.sub(r"sha256-[A-Za-z0-9+/=]+",'sha256-'+digest,text,count=1)
        page.write_text(text)
    config=output/'site-config.js'
    config.write_text(config.read_text().replace(OLD,base).replace("sitePath:'/abruzzofoto/'","sitePath:'/'"))
    sitemap=output/'sitemap.xml'
    sitemap.write_text(sitemap.read_text().replace(OLD,base))
    (output/'robots.txt').write_text('User-agent: *\nAllow: /\nSitemap: '+base+'sitemap.xml\n')
    csp="default-src 'self'; base-uri 'none'; object-src 'none'; script-src 'self' https://www.googletagmanager.com "+' '.join("'sha256-"+v+"'" for v in sorted(hashes))+"; style-src 'self'; style-src-attr 'unsafe-inline'; font-src 'self'; img-src 'self' data: https://*.google-analytics.com https://www.googletagmanager.com; connect-src 'self' https://*.google-analytics.com https://www.googletagmanager.com; frame-src 'none'; frame-ancestors 'none'; form-action https://formsubmit.co; upgrade-insecure-requests"
    headers={'Content-Security-Policy':csp,'X-Content-Type-Options':'nosniff','X-Frame-Options':'DENY','Referrer-Policy':'strict-origin-when-cross-origin','Permissions-Policy':'camera=(), microphone=(), geolocation=()'}
    cfg=ET.Element('configuration');server=ET.SubElement(cfg,'system.webServer')
    defaults=ET.SubElement(ET.SubElement(server,'defaultDocument'),'files');ET.SubElement(defaults,'clear');ET.SubElement(defaults,'add',value='index.html')
    ET.SubElement(server,'directoryBrowse',enabled='false')
    static=ET.SubElement(server,'staticContent')
    for ext,mime in [('.woff2','font/woff2'),('.svg','image/svg+xml')]:
        ET.SubElement(static,'remove',fileExtension=ext);ET.SubElement(static,'mimeMap',fileExtension=ext,mimeType=mime)
    custom=ET.SubElement(ET.SubElement(server,'httpProtocol'),'customHeaders')
    for name,value in headers.items():ET.SubElement(custom,'remove',name=name);ET.SubElement(custom,'add',name=name,value=value)
    rules=ET.SubElement(ET.SubElement(server,'rewrite'),'rules')
    legacy={'Home.html':'','Matrimoni.html':'matrimoni.html','Book.html':'ritratti.html','Saggi_di_Danza.html':'danza-sport.html','Sport.html':'danza-sport.html','Macro.html':'macro.html','Servizi.html':'#servizi','Contattami.html':'#contatti'}
    for index,(old,new) in enumerate(legacy.items()):
        rule=ET.SubElement(rules,'rule',name='AbruzzoFotoLegacy'+str(index),stopProcessing='true')
        ET.SubElement(rule,'match',url='^_/'+re.escape(old)+'$',ignoreCase='true')
        ET.SubElement(rule,'action',type='Redirect',url=base+new,redirectType='Permanent',appendQueryString='false')
    errors=ET.SubElement(server,'httpErrors',errorMode='Custom',existingResponse='Auto');ET.SubElement(errors,'remove',statusCode='404',subStatusCode='-1');ET.SubElement(errors,'error',statusCode='404',path='/404.html',responseMode='ExecuteURL')
    ET.indent(cfg,space='  ');ET.ElementTree(cfg).write(output/'web.config',encoding='utf-8',xml_declaration=True)
    zip_path=output.with_suffix('.zip')
    with zipfile.ZipFile(zip_path,'w',zipfile.ZIP_DEFLATED) as archive:
        for file in sorted(output.rglob('*')):
            if file.is_file():archive.write(file,file.relative_to(output))
    result={'base':base,'public_directory':str(output),'archive':str(zip_path),'files':sum(f.is_file() for f in output.rglob('*')),'sha256':hashlib.sha256(zip_path.read_bytes()).hexdigest()}
    print(json.dumps(result,indent=2));return result
if __name__=='__main__':
    parser=argparse.ArgumentParser();parser.add_argument('--base',default='https://www.abruzzofoto.it/');parser.add_argument('--output',type=Path,required=True);args=parser.parse_args();export(args.base,args.output)
