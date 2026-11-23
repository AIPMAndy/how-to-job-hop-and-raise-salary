#!/usr/bin/env python3
"""Verify byte-for-byte GitHub Pages publication; CI commits alone never prove delivery."""
from pathlib import Path
import hashlib, sys, time, urllib.request

ROOT=Path(__file__).resolve().parents[1]
BASE="https://aipmandy.github.io/how-to-job-hop-and-raise-salary/"
FILES=("index.html","compare.html","compare.js","robots.txt","sitemap.xml",
       "pdf/how-to-job-hop-and-raise-salary-guide.pdf")

def fetch(path):
    req=urllib.request.Request(BASE+path,headers={"User-Agent":"AIPMAndy-verify-live/1.0","Cache-Control":"no-cache"})
    with urllib.request.urlopen(req,timeout=30) as resp:
        if resp.status!=200: raise ValueError(f"HTTP {resp.status}")
        return resp.read()

def verify():
    failures=[]
    for path in FILES:
        local=(ROOT/path).read_bytes()
        local_sha=hashlib.sha256(local).hexdigest()
        try:
            remote=fetch(path)
            remote_sha=hashlib.sha256(remote).hexdigest()
            if local_sha!=remote_sha:
                failures.append(f"{path}: SHA mismatch {local_sha[:12]} != {remote_sha[:12]}")
            else:
                print(f"PASS HTTP 200 / SHA-256 {path} {local_sha}",flush=True)
        except Exception as error:
            failures.append(f"{path}: {error}")
    return failures

def main():
    for attempt in range(1,25):
        print(f"Published Pages check {attempt}/24",flush=True)
        issues=verify()
        if not issues:
            print("PASS 6/6 live files match deployed main bytes",flush=True)
            return 0
        for issue in issues: print("WAIT "+issue,flush=True)
        if attempt<24: time.sleep(15)
    print("FAIL: main not fully visible on public Pages; DO NOT mark deployed",file=sys.stderr)
    return 1

if __name__=="__main__": sys.exit(main())
