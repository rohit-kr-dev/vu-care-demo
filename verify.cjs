const vm=require('node:vm'),fs=require('node:fs'),assert=require('node:assert/strict');
const nodes={},listeners={},registered=[];
const node=s=>nodes[s]??={innerHTML:'',textContent:'',value:'',style:{},dataset:{},classList:{add(){},remove(){},toggle(){}},showModal(){},close(){},focus(){},setSelectionRange(){}};
const sandbox={document:{querySelector:node,querySelectorAll:()=>[],addEventListener:(n,f)=>(listeners[n]??=[]).push(f),body:node('body'),modelContext:{registerTool:t=>registered.push(t)}},window:{addEventListener(){},print(){}},localStorage:{getItem:()=>null,setItem(){}},structuredClone,location:{hash:''},setTimeout:()=>1,clearTimeout(){},console,URL,Blob};
vm.createContext(sandbox);vm.runInContext(fs.readFileSync('dist/app.js','utf8'),sandbox);
for(const role of ['Admin','Sales','Operations','Field Staff','Accounts','Support']){vm.runInContext(`role=${JSON.stringify(role)};for(const p of access[role]){page=p;render();if(!$('#main').innerHTML.length)throw Error('Empty page')}`,sandbox)}
vm.runInContext("role='Admin';page='overview';render()",sandbox);
assert.equal(registered.length,1);assert.equal(registered[0].execute({view:'leads'}).view,'leads');assert.throws(()=>registered[0].execute({view:'missing'}));
function click(dataset){listeners.click.forEach(f=>f({target:{closest:()=>({dataset})},preventDefault(){}}))}
click({convert:'101'});assert.equal(vm.runInContext('db.jobs.length',sandbox),6);assert.equal(vm.runInContext('db.leads[0].status',sandbox),'Converted');click({convert:'101'});assert.equal(vm.runInContext('db.jobs.length',sandbox),6);
vm.runInContext("role='Field Staff'",sandbox);assert.equal(vm.runInContext('jobs().every(j=>j.team===\'Team A · Ravi\')',sandbox),true);assert.throws(()=>registered[0].execute({view:'payments'}));
vm.runInContext("role='Admin';invoice(2401);jobDetail(2401);leadDetail(102);customerDetail('Aditi Menon');ticketForm();newLead()",sandbox);
console.log('PASS: all role views, dialogs, conversion and duplicate prevention, field scoping, WebMCP valid and invalid navigation.');
