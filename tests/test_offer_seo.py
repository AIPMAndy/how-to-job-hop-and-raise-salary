"""Regression and SEO/manifest QA for offer comparison (no network during tests)."""
import json
from pathlib import Path
import re
import unittest
import xml.etree.ElementTree as ET
ROOT=Path(__file__).resolve().parents[1]

class OfferCompareTest(unittest.TestCase):
    def test_generated_home_keeps_existing_50_tasks(self):
        home=(ROOT/"index.html").read_text(encoding="utf-8")
        self.assertEqual(home.count('class="card task-card"'),50)
        self.assertIn('href="compare.html"',home)
        self.assertIn('href="pdf/how-to-job-hop-and-raise-salary-guide.pdf"',home)
        self.assertIn("https://www.a6no1.cn/",home)
        self.assertIn("https://metaver.vip/services",home)
        self.assertIn("AIPMAndy",home)
    def test_pdf_manifest_not_overwritten(self):
        ed=json.loads((ROOT/"pdf/edition.json").read_text(encoding="utf-8"))
        self.assertEqual(ed["pages"],124)
        self.assertTrue((ROOT/ed["pdf_path"]).is_file())
        self.assertEqual(ed["sha256"],"9ce5626b8b3d9b1f47eaf534234771bb81f5a364d4ced2aad7b036869d8d6e21")
    def test_seo_and_structured_data(self):
        p=(ROOT/"compare.html").read_text(encoding="utf-8")
        self.assertEqual(p.count("<h1>"),1)
        self.assertEqual(p.count('rel="canonical"'),1)
        self.assertIn('https://aipmandy.github.io/how-to-job-hop-and-raise-salary/compare.html',p)
        self.assertIn('name="robots" content="index,follow"',p)
        self.assertIn('2026-10-12',p)
        blocks=re.findall(r'<script type="application/ld\\+json">(.+?)</script>',p,re.S)
        self.assertEqual(len(blocks),1)
        data=json.loads(blocks[0])
        self.assertEqual(data["url"],"https://aipmandy.github.io/how-to-job-hop-and-raise-salary/compare.html")
        self.assertEqual(data["dateModified"],"2026-11-23")
        self.assertEqual(data["author"]["url"],"https://metaver.vip/")
        self.assertEqual(data["publisher"]["url"],"https://www.a6no1.cn/")
        self.assertIn("navigator.clipboard.writeText",p)
    def test_sitemap_and_source(self):
        site=ET.parse(ROOT/"sitemap.xml")
        ns={"s":"http://www.sitemaps.org/schemas/sitemap/0.9"}
        entries=[x.text for x in site.findall("s:url/s:loc",ns)]
        self.assertIn("https://aipmandy.github.io/how-to-job-hop-and-raise-salary/compare.html",entries)
        self.assertIn("compare.html",(ROOT/"build.py").read_text(encoding="utf-8"))
        self.assertTrue((ROOT/"compare.js").exists())
        self.assertIn("Sitemap:",(ROOT/"robots.txt").read_text(encoding="utf-8"))
    def test_no_third_party_script_or_sensitive_fields(self):
        p=(ROOT/"compare.html").read_text(encoding="utf-8")
        self.assertNotIn("https://cdn.",p)
        self.assertNotIn('name="company"',p)
        self.assertNotIn('name="realName"',p)
        self.assertNotIn("fetch(",(ROOT/"compare.js").read_text(encoding="utf-8"))
if __name__=="__main__": unittest.main()
