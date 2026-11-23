/* Jump salary comparison: pure model first, browser UI second. No tracking. */
(function (root, factory) {
  "use strict";
  const api = factory();
  if (typeof module === "object" && module.exports) module.exports = api;
  root.JobHopMath = api;
  if (typeof document !== "undefined") api.init(document);
})(typeof globalThis !== "undefined" ? globalThis : this, function () {
  "use strict";
  const fieldNames = ["current", "newOffer", "gap", "annualExtra", "oneOff", "signing"];
  function numeric(value, name, max) {
    if (value === "" || value === null || value === undefined) throw new Error(name + "不能为空");
    const n = Number(value);
    if (!Number.isFinite(n) || n < 0 || n > max) throw new Error(name + "必须是有效的非负数（上限 " + max + "）");
    return n;
  }
  function compare(input) {
    if (!input || typeof input !== "object") throw new Error("请先填写完整数据");
    const current = numeric(input.current, "现岗位保证年度现金", 1000000000);
    const next = numeric(input.newOffer, "新岗位保证年度现金", 1000000000);
    const gap = numeric(input.gap, "预计空窗月数", 12);
    const annualExtra = numeric(input.annualExtra, "每年额外成本", 1000000000);
    const oneOff = numeric(input.oneOff, "一次性支出", 1000000000);
    const signing = numeric(input.signing, "明确保证且可兑现的签约金", 1000000000);
    if (!Number.isInteger(gap)) throw new Error("空窗月数请填 0 到 12 的整数");
    const monthsWorked = 12 - gap;
    const recurringYearDelta = next - current - annualExtra;
    const monthlyDelta = recurringYearDelta / 12;
    const firstYearDelta = (next - annualExtra) * monthsWorked / 12 - current + signing - oneOff;
    const recoveryCost = (current / 12) * gap + oneOff - signing;
    let breakEvenMonths = null, reason = "";
    if (recoveryCost <= 0) breakEvenMonths = 0;
    else if (monthlyDelta > 0) breakEvenMonths = Math.ceil(recoveryCost / monthlyDelta);
    else reason = "持续年度增量不为正，按此假设无法靠现金差额收回成本";
    return {recurringYearDelta, monthlyDelta, firstYearDelta, recoveryCost, breakEvenMonths, reason, monthsWorked};
  }
  function init(doc) {
    const form = doc.getElementById("compare-form");
    if (!form) return;
    const output = doc.getElementById("result");
    const download = doc.getElementById("download");
    let report = null;
    const fmt = n => new Intl.NumberFormat("zh-CN",{style:"currency",currency:"CNY",maximumFractionDigits:2}).format(n);
    function render() {
      const fields = Object.fromEntries(fieldNames.map(k => [k, form.elements.namedItem(k).value]));
      try {
        report = compare(fields);
        const lines = [
          "持续年度税前现金差额：" + fmt(report.recurringYearDelta),
          "第一个12个月相对留任的税前净差额：" + fmt(report.firstYearDelta),
          "空窗损失与一次性成本减去签约金：" + fmt(report.recoveryCost),
          report.breakEvenMonths === null ? report.reason : "入职后回本周期：" + report.breakEvenMonths + " 个月（整数向上取整）"
        ];
        output.textContent = lines.join("\n");
        output.dataset.state = "ok";
        download.disabled = false;
      } catch (error) {
        report = null;
        output.textContent = error.message;
        output.dataset.state = "error";
        download.disabled = true;
      }
    }
    form.addEventListener("input", render);
    form.addEventListener("submit", event => event.preventDefault());
    download.addEventListener("click", () => {
      if (!report) return;
      const content = [
        "跳槽回本对比：个人本地估算（不代表真实Offer结果）",
        "计算日期："+new Date().toISOString().slice(0,10),
        "所有金额单位：人民币、税前；无上传；未计税费/股权/奖金",
        ...fieldNames.map(k=>k+" = "+form.elements.namedItem(k).value),
        "持续年度差额 = "+report.recurringYearDelta.toFixed(2),
        "首12个月净差额 = "+report.firstYearDelta.toFixed(2),
        "回本月数 = "+(report.breakEvenMonths===null?"无法按假设回本":report.breakEvenMonths),
        "方法和边界：https://aipmandy.github.io/how-to-job-hop-and-raise-salary/compare.html"
      ].join("\n");
      const url=URL.createObjectURL(new Blob([content],{type:"text/plain;charset=utf-8"}));
      const anchor=doc.createElement("a");
      anchor.href=url; anchor.download="jump-offer-compare.txt";
      doc.body.appendChild(anchor); anchor.click(); anchor.remove();
      setTimeout(()=>URL.revokeObjectURL(url),1000);
    });
    render();
  }
  return {compare,init};
});
