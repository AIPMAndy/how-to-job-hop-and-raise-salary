# GitHub发布与内容运营SOP

## 第0关：文件与诚信检查

- [ ] `python3 build.py` 生成最新离线 `index.html`；生成静态章节HTML之前可选安装`pip install -r requirements-dev.txt`
- [ ] `python3 -m unittest discover -s tests -v` 无失败
- [ ] 随机抽10条任务能按步骤执行，不存在保证结果的说法
- [ ] `audit/ADVERSARIAL_REVIEW.md` 的人工待验项逐项勾选
- [ ] 所有示例数字标为假设，所有外链人工点开核验
- [ ] 无个人简历原件、收入证明、合同、客户资料或密钥被提交

## 第1关：仓库上线

1. 新建**同名空的公开仓库**，默认分支`main`；不要与已存在仓库混淆。
2. 将本包所有文件提交到仓库根目录。可用终端：

```bash
git init
git branch -M main
git add .
git commit -m "feat: publish practical career handbook"
git remote add origin <自己新建仓库的git地址>
git push -u origin main
```

3. 在Settings → Pages → Build and deployment → Deploy from a branch，选`main`与`/(root)`，保存。官方说明：[GitHub Pages发布源](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。
4. 仓库About填写一句话描述、网址、Topics：`career`、`career-development`、`chinese`、`job-search`等，避免塞无关热词。
5. 在仓库 Settings → General → Social preview 上传已提供的 `assets/social-preview.png`（1280×640，基于真实网页截图），再从桌面和手机核对README首屏。

## 第2关：对外发布

- 公众号长文：实际困境→解决流程→一个示范→模板和项目链接。
- 短视频：开头3秒给具体痛点；只教一个步骤；结尾只给GitHub仓库/个人主页指引，遵守平台导流规则。
- 图文：3:4封面；1张问题、4~6张方法、1张模板/仓库，不伪造对比前后数据。
- 分发时保留不同来源标识在**自己私有的统计表**中，不写入用户敏感数据。

## 第3关：运营与迭代

- 上线前确定基线：Star、Fork、访客、有效咨询线索和成交分别记录。
- 第1周读Issue，修用户卡点最多的一章。
- 第2周用咨询中已去标识化的共性问题补模板，不公开真实客户资料。
- 第3~4周回看真实线索→成交，不以播放量判断商业成功。

**退出条件**：若30天有浏览但无人完成模板，优先修任务可用性；若有人使用却无咨询，评估CTA与客群匹配，不能据此断言服务无价值。
