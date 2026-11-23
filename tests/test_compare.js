const test = require("node:test");
const assert = require("node:assert/strict");
const { compare } = require("../compare.js");
test("same salary, no fees or gap yields zero",()=>{
  const r=compare({current:240000,newOffer:240000,gap:0,annualExtra:0,oneOff:0,signing:0});
  assert.equal(r.firstYearDelta,0);assert.equal(r.recurringYearDelta,0);assert.equal(r.breakEvenMonths,0);
});
test("higher offer: gap loss and relocation produce break-even in months",()=>{
  const r=compare({current:240000,newOffer:300000,gap:2,annualExtra:12000,oneOff:20000,signing:0});
  // 48k annual recurring delta, 4k per month, gap loss 40k + one-off 20k = 60k
  assert.equal(r.recurringYearDelta,48000);
  assert.equal(r.firstYearDelta,(300000-12000)*10/12-240000-20000);
  assert.equal(r.breakEvenMonths,15);
});
test("cash on arrival may cover transition cost",()=>{
  const r=compare({current:120000,newOffer:180000,gap:0,annualExtra:0,oneOff:10000,signing:20000});
  assert.equal(r.breakEvenMonths,0);
  assert.equal(r.firstYearDelta,70000);
});
test("negative recurring delta must not advertise a recovery period",()=>{
  const r=compare({current:300000,newOffer:250000,gap:2,annualExtra:0,oneOff:0,signing:0});
  assert.equal(r.breakEvenMonths,null);
  assert.match(r.reason,/无法/);
});
test("no silent zero defaults or invalid numbers",()=>{
  const valid={current:200000,newOffer:300000,gap:0,annualExtra:0,oneOff:0,signing:0};
  for(const [field,value] of [["current",""],["newOffer",null],["gap",13],["gap",-1],["gap",0.5],["oneOff","banana"],["signing",Infinity],["annualExtra",-1]]) {
    assert.throws(()=>compare({...valid,[field]:value}),Error);
  }
});
test("returns finite numbers within input range",()=>{
  const r=compare({current:0,newOffer:0,gap:12,annualExtra:0,oneOff:0,signing:0});
  assert.equal(r.monthsWorked,0);assert.equal(r.firstYearDelta,0);
  assert.ok(Number.isFinite(r.recoveryCost));
});
