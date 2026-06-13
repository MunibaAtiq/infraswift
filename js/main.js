/* ============================================================
   INFRASWIFT — main.js
   Particle Canvas · Chart.js · Counters · FAQ · Animations
   ============================================================ */
$(function(){

  /* ── NAVBAR ─────────────────────────────────── */
  $(window).on('scroll.nav',function(){
    var s=$(this).scrollTop();
    s>60?$('#nav').addClass('scrolled'):$('#nav').removeClass('scrolled');
    s>300?$('#stTop').addClass('vis'):$('#stTop').removeClass('vis');
    if($('.parallax-layer').length){
      $('.parallax-layer').css('transform','translateY('+(s*.28)+'px)');
    }
  });
  $('#stTop').on('click',function(){$('html,body').animate({scrollTop:0},600)});

  /* ── ACTIVE NAV ─────────────────────────────── */
  var pg=window.location.pathname.split('/').pop()||'index.html';
  $('#nav .nav-link').each(function(){if($(this).attr('href')===pg)$(this).addClass('active')});

  /* ── COUNTERS ───────────────────────────────── */
  function runCounters(){
    $('.counter:not([data-done])').each(function(){
      $(this).attr('data-done','1');
      var $e=$(this),t=parseFloat($e.data('target')),dec=$e.data('dec')||0;
      var d=1900,step=t/(d/16),cur=0;
      var iv=setInterval(function(){
        cur+=step;if(cur>=t){cur=t;clearInterval(iv);}
        $e.text(dec>0?cur.toFixed(dec):Math.floor(cur));
      },16);
    });
  }

  /* ── INTERSECTION OBSERVER ──────────────────── */
  if('IntersectionObserver' in window){
    var ro=new IntersectionObserver(function(en){
      en.forEach(function(e){if(e.isIntersecting)e.target.classList.add('vis')});
    },{threshold:.08});
    document.querySelectorAll('.rev,.rev-l,.rev-r,.rev-sc').forEach(function(el){ro.observe(el)});
    var co=new IntersectionObserver(function(en){
      en.forEach(function(e){if(e.isIntersecting)runCounters()});
    },{threshold:.25});
    document.querySelectorAll('.counter-sec,.stats-bar,.a-stat-row').forEach(function(el){co.observe(el)});
  } else {
    document.querySelectorAll('.rev,.rev-l,.rev-r,.rev-sc').forEach(function(el){el.classList.add('vis')});
    runCounters();
  }

  /* ── FAQ ─────────────────────────────────────── */
  $(document).on('click','.faq-q',function(){
    var $a=$(this).next('.faq-a'),isOpen=$a.hasClass('open');
    $('.faq-a').removeClass('open');$('.faq-q').removeClass('open');$('.faq-ic').html('+');
    if(!isOpen){$a.addClass('open');$(this).addClass('open');$(this).find('.faq-ic').html('&times;');}
  });

  /* ── SMOOTH ANCHOR ──────────────────────────── */
  $(document).on('click','a[href^="#"]',function(e){
    var t=$(this).attr('href');
    if(t==='#'||!$(t).length)return;
    e.preventDefault();
    $('html,body').animate({scrollTop:$(t).offset().top-82},700);
  });

  /* ── MOBILE NAV CLOSE ───────────────────────── */
  $('.navbar-nav .nav-link:not(.dropdown-toggle)').on('click',function(){
    if($('.navbar-collapse').hasClass('show'))$('.navbar-toggler').trigger('click');
  });

  /* ── CONTACT FORM ───────────────────────────── */
  $('#cForm').on('submit',function(e){
    e.preventDefault();
    var $b=$(this).find('.sub-btn');
    $b.prop('disabled',true).html('<i class="fas fa-spinner fa-spin me-2"></i>Sending...');
    setTimeout(function(){
      $b.html('<i class="fas fa-check me-2"></i>Sent! We reply within 24hrs');
      setTimeout(function(){
        $b.prop('disabled',false).html('<i class="fas fa-paper-plane me-2"></i>Send Message');
        $('#cForm')[0].reset();
      },3500);
    },1800);
  });

  /* ── STAGGER ─────────────────────────────────── */
  document.querySelectorAll('.stagger').forEach(function(p){
    Array.from(p.children).forEach(function(c,i){c.style.transitionDelay=(i*.1)+'s'});
  });

  /* ── MOUSE PARALLAX ON HERO ─────────────────── */
  $(document).on('mousemove','.hero',function(e){
    var mx=(e.clientX/$(window).width()-.5)*20;
    var my=(e.clientY/$(window).height()-.5)*14;
    $('.hero-glow-m').css('transform','translate('+mx+'px,'+my+'px)');
  });

  /* ══════════════════════════════════════════════
     PARTICLE CANVAS HERO
     ══════════════════════════════════════════════ */
  var canvas=document.getElementById('heroCanvas');
  if(canvas){
    var ctx=canvas.getContext('2d'),W,H,parts=[],COUNT=100;
    function resize(){W=canvas.width=canvas.offsetWidth;H=canvas.height=canvas.offsetHeight;}
    resize();window.addEventListener('resize',resize);
    function P(){this.reset();}
    P.prototype.reset=function(){
      this.x=Math.random()*W;this.y=Math.random()*H;
      this.r=Math.random()*1.8+.3;
      this.speed=Math.random()*.35+.1;
      this.angle=Math.random()*Math.PI*2;
      this.vx=Math.cos(this.angle)*this.speed;
      this.vy=Math.sin(this.angle)*this.speed;
      this.life=Math.random();this.maxLife=.6+Math.random()*.4;
      this.cyan=Math.random()>.4;
    };
    for(var i=0;i<COUNT;i++){var p=new P();p.life=Math.random()*p.maxLife;parts.push(p);}
    var mouse={x:-999,y:-999};
    canvas.addEventListener('mousemove',function(e){
      var r=canvas.getBoundingClientRect();mouse.x=e.clientX-r.left;mouse.y=e.clientY-r.top;
    });
    function drawLines(){
      for(var a=0;a<parts.length;a++){
        for(var b=a+1;b<parts.length;b++){
          var dx=parts[a].x-parts[b].x,dy=parts[a].y-parts[b].y;
          var d=Math.sqrt(dx*dx+dy*dy);
          if(d<110){ctx.beginPath();ctx.strokeStyle='rgba(0,198,255,'+(1-d/110)*.1+')';ctx.lineWidth=.5;ctx.moveTo(parts[a].x,parts[a].y);ctx.lineTo(parts[b].x,parts[b].y);ctx.stroke();}
        }
        var mdx=parts[a].x-mouse.x,mdy=parts[a].y-mouse.y,md=Math.sqrt(mdx*mdx+mdy*mdy);
        if(md<160){ctx.beginPath();ctx.strokeStyle='rgba(57,255,20,'+(1-md/160)*.2+')';ctx.lineWidth=.7;ctx.moveTo(parts[a].x,parts[a].y);ctx.lineTo(mouse.x,mouse.y);ctx.stroke();}
      }
    }
    function animate(){
      ctx.clearRect(0,0,W,H);drawLines();
      parts.forEach(function(p){
        p.life+=.004;if(p.life>p.maxLife){p.reset();return;}
        var a=p.life<.1?p.life/.1:p.life>p.maxLife-.1?(p.maxLife-p.life)/.1:1;
        a=Math.min(1,Math.max(0,a))*.65;
        p.x+=p.vx;p.y+=p.vy;
        if(p.x<-5)p.x=W+5;if(p.x>W+5)p.x=-5;
        if(p.y<-5)p.y=H+5;if(p.y>H+5)p.y=-5;
        ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
        ctx.fillStyle=p.cyan?'rgba(0,198,255,'+a+')':'rgba(57,255,20,'+(a*.7)+')';
        ctx.fill();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ══════════════════════════════════════════════
     TYPEWRITER EFFECT
     ══════════════════════════════════════════════ */
  var twEl=document.getElementById('typewriter');
  if(twEl){
    var words=['Infrastructure.','Automation.','Cloud Solutions.','IT Strategy.'],wi=0,ci=0,del=false;
    function type(){
      var w=words[wi];
      if(!del){twEl.textContent=w.substring(0,ci+1);ci++;if(ci===w.length){del=true;setTimeout(type,1800);return;}}
      else{twEl.textContent=w.substring(0,ci-1);ci--;if(ci===0){del=false;wi=(wi+1)%words.length;}}
      setTimeout(type,del?60:110);
    }
    type();
  }

  /* ══════════════════════════════════════════════
     CHART.JS CONFIGURATIONS
     ══════════════════════════════════════════════ */
  if(typeof Chart==='undefined')return;

  Chart.defaults.font.family="'Inter',sans-serif";
  Chart.defaults.color='#7A93BC';

  var cOpts={
    responsive:true,maintainAspectRatio:true,
    plugins:{
      legend:{labels:{color:'#3D5280',font:{size:12,weight:'600'},boxWidth:14,padding:18}},
      tooltip:{backgroundColor:'rgba(13,17,23,.92)',borderColor:'rgba(0,198,255,.3)',borderWidth:1,titleColor:'#fff',bodyColor:'#94A3B8',padding:12}
    }
  };

  /* ── ROI Line Chart ─────────────────────────── */
  var roi=document.getElementById('roiChart');
  if(roi){
    new Chart(roi,{
      type:'line',
      data:{
        labels:['Month 1','Month 2','Month 3','Month 4','Month 5','Month 6'],
        datasets:[{
          label:'With InfraSwift',
          data:[0,18,35,52,68,85],
          borderColor:'#00C6FF',backgroundColor:'rgba(0,198,255,.07)',
          borderWidth:2.5,fill:true,tension:.45,
          pointRadius:5,pointBackgroundColor:'#00C6FF',pointBorderColor:'#fff',pointBorderWidth:2,
        },{
          label:'Traditional IT',
          data:[0,4,7,9,11,13],
          borderColor:'#39FF14',backgroundColor:'rgba(57,255,20,.04)',
          borderWidth:2,fill:true,tension:.45,borderDash:[5,3],
          pointRadius:4,pointBackgroundColor:'#39FF14',pointBorderColor:'#fff',pointBorderWidth:2,
        }]
      },
      options:$.extend(true,{},cOpts,{
        scales:{
          y:{grid:{color:'rgba(0,198,255,.06)'},ticks:{callback:function(v){return v+'%'}},title:{display:true,text:'Efficiency Gain',color:'#7A93BC',font:{size:11}}},
          x:{grid:{color:'rgba(0,198,255,.04)'}}
        }
      })
    });
  }

  /* ── Pie Chart — Project Breakdown ────────── */
  var pieCtx=document.getElementById('projPie');
  if(pieCtx){
    new Chart(pieCtx,{
      type:'pie',
      data:{
        labels:['Infrastructure Automation','Cloud Migrations','IT Consultancy','Monitoring Setup'],
        datasets:[{
          data:[38,28,18,16],
          backgroundColor:['rgba(0,198,255,.85)','rgba(0,229,255,.75)','rgba(57,255,20,.7)','rgba(0,230,118,.65)'],
          borderColor:'#fff',borderWidth:3,hoverOffset:10,
        }]
      },
      options:$.extend(true,{},cOpts,{
        plugins:{
          legend:{position:'bottom',labels:{padding:16,boxWidth:13,font:{size:11}}},
          tooltip:{callbacks:{label:function(c){return ' '+c.label+': '+c.raw+'%'}}}
        }
      })
    });
  }

  /* ── Doughnut — Capability ──────────────────── */
  var dCtx=document.getElementById('capDoughnut');
  if(dCtx){
    new Chart(dCtx,{
      type:'doughnut',
      data:{
        labels:['Automation','Cloud','Consultancy','Monitoring','Support'],
        datasets:[{
          data:[95,90,85,92,96],
          backgroundColor:['rgba(0,198,255,.85)','rgba(0,229,255,.75)','rgba(57,255,20,.7)','rgba(0,230,118,.65)','rgba(0,102,255,.6)'],
          borderColor:'#fff',borderWidth:3,hoverOffset:8,
        }]
      },
      options:$.extend(true,{},cOpts,{
        cutout:'62%',
        plugins:{
          legend:{position:'right',labels:{padding:14,boxWidth:12,font:{size:11}}},
          tooltip:{callbacks:{label:function(c){return ' '+c.label+': '+c.raw+'%'}}}
        }
      })
    });
  }

  /* ── Uptime Bar Chart ───────────────────────── */
  var uptCtx=document.getElementById('uptimeChart');
  if(uptCtx){
    new Chart(uptCtx,{
      type:'bar',
      data:{
        labels:['Jan','Feb','Mar','Apr','May','Jun'],
        datasets:[{
          label:'Uptime %',
          data:[99.9,99.8,100,99.9,99.9,100],
          backgroundColor:['rgba(0,198,255,.8)','rgba(0,229,255,.75)','rgba(57,255,20,.7)','rgba(0,198,255,.8)','rgba(0,229,255,.75)','rgba(57,255,20,.7)'],
          borderColor:'transparent',borderRadius:8,borderSkipped:false,
        }]
      },
      options:$.extend(true,{},cOpts,{
        plugins:{legend:{display:false},tooltip:{callbacks:{label:function(c){return ' '+c.raw+'%'}}}},
        scales:{
          y:{min:99.4,max:100.4,grid:{color:'rgba(0,198,255,.06)'},ticks:{callback:function(v){return v+'%'}}},
          x:{grid:{display:false}}
        }
      })
    });
  }

  /* ── Radar Chart ────────────────────────────── */
  var radCtx=document.getElementById('radChart');
  if(radCtx){
    new Chart(radCtx,{
      type:'radar',
      data:{
        labels:['Automation','Cloud','Consultancy','Monitoring','Security','Support'],
        datasets:[{
          label:'InfraSwift',data:[95,90,85,92,88,96],
          borderColor:'#00C6FF',backgroundColor:'rgba(0,198,255,.1)',
          pointBackgroundColor:'#00C6FF',borderWidth:2,
        },{
          label:'Industry Avg',data:[60,55,50,62,58,55],
          borderColor:'#39FF14',backgroundColor:'rgba(57,255,20,.05)',
          pointBackgroundColor:'#39FF14',borderWidth:1.5,borderDash:[4,3],
        }]
      },
      options:$.extend(true,{},cOpts,{
        scales:{r:{
          grid:{color:'rgba(0,198,255,.08)'},
          angleLines:{color:'rgba(0,198,255,.06)'},
          ticks:{backdropColor:'transparent',font:{size:9},color:'#7A93BC'},
          pointLabels:{color:'#3D5280',font:{size:11,weight:'600'}}
        }}
      })
    });
  }

});
