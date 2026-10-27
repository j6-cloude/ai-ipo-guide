(function(){
  var L=document.documentElement.lang.indexOf('zh')===0?'zh':'en';
  var T={zh:{wd:['周日','周一','周二','周三','周四','周五','周六'],res:'解禁日（日历日）：',wk:'注意：该日为周末，实际可交易日顺延到下一个交易日（本工具不计美国假期）。',bad:'请输入有效日期和天数。',conv:'换算结果'},
         en:{wd:['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],res:'Unlock date (calendar days): ',wk:'Note: this falls on a weekend; the first tradable day would be the next trading day (US holidays are not handled).',bad:'Enter a valid date and number of days.',conv:'Converted'}}[L];
  function $(id){return document.getElementById(id)}
  // Lockup calculator
  var go=$('lk-go');
  if(go){
    function run(){
      var v=$('lk-date').value,n=parseInt($('lk-days').value,10),o=$('lk-out');
      if(!v||isNaN(n)){o.textContent=T.bad;return}
      var p=v.split('-'),t=Date.UTC(+p[0],+p[1]-1,+p[2])+n*86400000,d=new Date(t);
      var s=d.toISOString().slice(0,10),w=d.getUTCDay();
      o.textContent=T.res+s+' ('+T.wd[w]+')'+((w===0||w===6)?' — '+T.wk:'');
    }
    go.addEventListener('click',run);
    document.querySelectorAll('[data-lk]').forEach(function(b){b.addEventListener('click',function(){
      var a=b.getAttribute('data-lk').split('|');$('lk-date').value=a[0];$('lk-days').value=a[1];run();});});
  }
  // ET -> other zones converter
  var cg=$('tz-go');
  if(cg){
    function off(t,tz){
      var f=new Intl.DateTimeFormat('en-US',{timeZone:tz,hourCycle:'h23',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit'});
      var q={};f.formatToParts(new Date(t)).forEach(function(x){q[x.type]=x.value});
      return (Date.UTC(+q.year,+q.month-1,+q.day,+q.hour%24,+q.minute)-t)/60000;
    }
    function conv(){
      var dv=$('tz-date').value,tv=$('tz-time').value,o=$('tz-out');
      if(!dv||!tv){o.textContent=T.bad;return}
      var p=dv.split('-'),h=tv.split(':'),g=Date.UTC(+p[0],+p[1]-1,+p[2],+h[0],+h[1]);
      var t=g-off(g,'America/New_York')*60000;t=g-off(t,'America/New_York')*60000;
      var zones=[['新加坡 SGT / Singapore','Asia/Singapore'],['香港 HKT / Hong Kong','Asia/Hong_Kong'],['台北 / Taipei','Asia/Taipei'],['多伦多 / Toronto (ET)','America/Toronto'],['温哥华 / Vancouver (PT)','America/Vancouver']];
      var html='<table><tr><th>'+T.conv+'</th><th></th></tr>';
      zones.forEach(function(z){html+='<tr><td>'+z[0]+'</td><td>'+new Intl.DateTimeFormat(L==='zh'?'zh-CN':'en-CA',{timeZone:z[1],dateStyle:'medium',timeStyle:'short',hourCycle:'h23'}).format(new Date(t))+'</td></tr>'});
      o.innerHTML=html+'</table>';
    }
    cg.addEventListener('click',conv);conv();
  }
})();
