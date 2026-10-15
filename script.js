'use strict';
// CONFIGURACIÓN: coloca aquí el número real de WhatsApp Business (51 + número, solo dígitos).
const WHATSAPP_NUMBER = '51908862769'; // WhatsApp PETLU: +51 908 862 769.
// 12 artículos genéricos de DEMOSTRACIÓN. Fotos remotas ilustrativas de Unsplash.
const products = [
{id:1,name:'Arnés ajustable para perro',price:44.90,category:'paseo',pet:'perros',badge:'Favorito',description:'Arnés acolchado para paseos cómodos.',image:'photo-1601758228041-f3b2795255f1',emoji:'🦮'},
{id:2,name:'Cama suave para mascotas',price:89.90,category:'perros',pet:'perros',badge:'Descanso',description:'Un lugar acogedor para descansar.',image:'photo-1583337130417-3346a1be7dee',emoji:'🛏️'},
{id:3,name:'Pelota de juego',price:16.90,category:'juguetes',pet:'perros',badge:'Diversión',description:'Para juegos llenos de energía.',image:'photo-1558788353-f76d92427f16',emoji:'🎾'},
{id:4,name:'Collar clásico',price:22.90,category:'paseo',pet:'perros',badge:'Nuevo',description:'Collar práctico para el día a día.',image:'photo-1583511655857-d19b40a7a54e',emoji:'🐕'},
{id:5,name:'Rascador para gato',price:74.90,category:'gatos',pet:'gatos',badge:'Para michis',description:'Entretenimiento para gatos curiosos.',image:'photo-1514888286974-6c03e2ca1dba',emoji:'🐈'},
{id:6,name:'Ratón de juguete',price:14.90,category:'juguetes',pet:'gatos',badge:'Juego',description:'Un pequeño compañero de diversión.',image:'photo-1573865526739-10659fec78a5',emoji:'🐭'},
{id:7,name:'Transportadora de mascota',price:119.90,category:'gatos',pet:'gatos',badge:'Práctico',description:'Consulta medidas antes de elegir.',image:'photo-1511044568932-338cba0ad803',emoji:'🧺'},
{id:8,name:'Plato doble para comida',price:35.90,category:'perros',pet:'perros',badge:'Esencial',description:'Una opción para su rutina diaria.',image:'photo-1587300003388-59208cc962cb',emoji:'🥣'},
{id:9,name:'Correa de paseo',price:29.90,category:'paseo',pet:'perros',badge:'Paseo',description:'Para salir juntos con comodidad.',image:'photo-1543466835-00a7907e9de1',emoji:'🐾'},
{id:10,name:'Manta suave para gato',price:49.90,category:'gatos',pet:'gatos',badge:'Confort',description:'Manta para sus siestas favoritas.',image:'photo-1533738363-b7f9aef128ce',emoji:'🐱'},
{id:11,name:'Juguete mordedor',price:25.90,category:'juguetes',pet:'perros',badge:'Para jugar',description:'Accesorio de juego para perros.',image:'photo-1552053831-71594a27632d',emoji:'🦴'},
{id:12,name:'Cepillo de cuidado',price:32.90,category:'gatos',pet:'gatos',badge:'Cuidado',description:'Cepillado y cuidado de su pelaje.',image:'photo-1513360371669-4adf3dd7dff8',emoji:'🪮'}
];
const $ = s=>document.querySelector(s);
const money = n=>new Intl.NumberFormat('es-PE',{style:'currency',currency:'PEN'}).format(n);
const photo = p=>`https://images.unsplash.com/${p.image}?auto=format&fit=crop&w=700&q=80`;
const rates = {lima:12,callao:15,costa:22,sierra:28,selva:35}; // SOLOS SUPUESTOS ILUSTRATIVOS; no cotizaciones reales
const zones = {lima:'Lima Metropolitana',callao:'Callao',costa:'Otras ciudades de la costa',sierra:'Ciudades de la sierra',selva:'Ciudades de la selva'};
let activeFilter='todos', searchTerm='', cart={}, currentZone='', toastTimer;
function saveCart(){try{localStorage.setItem('petlu-cart-v1',JSON.stringify(cart));}catch(e){}}
function loadCart(){try{let c=JSON.parse(localStorage.getItem('petlu-cart-v1')||'{}');if(c&&typeof c==='object'){for(const [k,v] of Object.entries(c)){if(products.some(p=>p.id===+k)&&Number.isInteger(v)&&v>0&&v<=99)cart[k]=v;}}}catch(e){}}
function filtered(){return products.filter(p=>(activeFilter==='todos'||p.category===activeFilter||p.pet===activeFilter)&&(!searchTerm||(p.name+' '+p.description+' '+p.pet+' '+p.category).toLowerCase().includes(searchTerm)));}
function renderProducts(){const list=filtered();$('#productGrid').innerHTML=list.map(p=>`<article class="product-card"><div class="product-photo"><span class="tag">${p.badge}</span><img src="${photo(p)}" alt="Imagen ilustrativa: ${p.name}" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.style.display='grid'"><div class="photo-fallback" aria-hidden="true">${p.emoji}</div></div><div class="product-body"><small>${p.pet==='gatos'?'Gatos':'Perros'} · ${p.category}</small><h3>${p.name}</h3><p>${p.description}</p><div class="product-foot"><span class="price">${money(p.price)}</span><button class="add-product" data-add="${p.id}" aria-label="Agregar ${p.name}">+ Agregar</button></div></div></article>`).join('');$('#noResults').hidden=!!list.length;}
function items(){return Object.entries(cart).map(([id,qty])=>({p:products.find(p=>p.id===+id),qty})).filter(x=>x.p&&x.qty>0);}
function subtotal(){return items().reduce((s,x)=>s+x.p.price*x.qty,0);}function count(){return items().reduce((s,x)=>s+x.qty,0);}function shippingProvider(){return $('#shippingProvider')?.value||'';}function shipment(){return shippingProvider()==='shalom'?(rates[currentZone]??null):null;}
function toast(t){const el=$('#toast');el.textContent=t;el.classList.add('show');clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.remove('show'),2800);}
function renderCart(){let arr=items();$('#cartCount').textContent=count();$('#drawerCount').textContent=`(${count()})`;$('#cartLines').innerHTML=arr.length?arr.map(({p,qty})=>`<div class="cart-line"><img src="${photo(p)}" alt="${p.name}" onerror="this.style.display='none'"><div><h3>${p.name}</h3><small>${money(p.price)} por unidad</small><div class="quantity"><button data-change="${p.id}" data-delta="-1" aria-label="Restar ${p.name}">−</button><span>${qty}</span><button data-change="${p.id}" data-delta="1" aria-label="Sumar ${p.name}">+</button></div><button class="remove" data-remove="${p.id}">Eliminar</button></div><span class="cart-line-price">${money(p.price*qty)}</span></div>`).join(''):'<div class="empty-cart"><span>🛍️</span><h3>Tu carrito está vacío</h3><p>Encuentra algo especial para tu mascota.</p></div>';$('#cartSubtotal').textContent=money(subtotal());$('#cartShipping').textContent=shipment()===null?'Por cotizar':`${money(shipment())} (ejemplo)`;$('#cartGrand').textContent=shipment()===null?`${money(subtotal())} + envío por cotizar`:money(subtotal()+shipment());$('#goCheckout').disabled=!count();$('#goCheckout').style.opacity=count()?1:.5;saveCart();}
function lock(){document.body.style.overflow='hidden';}function unlock(){document.body.style.overflow='';}
function openCart(){renderCart();$('#drawerOverlay').hidden=false;$('#cartDrawer').classList.add('open');$('#cartDrawer').setAttribute('aria-hidden','false');lock();$('#closeCart').focus();}
function closeCart(){ $('#drawerOverlay').hidden=true;$('#cartDrawer').classList.remove('open');$('#cartDrawer').setAttribute('aria-hidden','true');unlock();}
function updateZone(z){currentZone=rates[z]!==undefined?z:'';$('#region').value=currentZone;$('#checkoutZone').value=currentZone;const rate=rates[currentZone]??null;$('#shippingResult').textContent=rate===null?'Selecciona un destino para consultar una estimación.':`Ejemplo de costo regional: ${money(rate)} para ${zones[currentZone]}. No corresponde a una tarifa confirmada de Shalom ni de DHL.`;renderCart();renderCheckoutSummary();}
function renderCheckoutSummary(){const arr=items();$('#checkoutLines').innerHTML=arr.map(({p,qty})=>`<div class="order-summary-item"><span>${qty} × ${p.name}</span><strong>${money(qty*p.price)}</strong></div>`).join('');$('#checkoutSubtotal').textContent=money(subtotal());$('#checkoutShipping').textContent=shipment()===null?'Por cotizar':`${money(shipment())} (ejemplo)`;$('#checkoutGrand').textContent=shipment()===null?`${money(subtotal())} + envío por cotizar`:money(subtotal()+shipment());}
function openCheckout(){if(!count())return;closeCart();renderCheckoutSummary();$('#orderResult').hidden=true;$('#checkoutOverlay').hidden=false;lock();$('#checkoutOverlay input').focus();}
function closeCheckout(){$('#checkoutOverlay').hidden=true;unlock();}
function setFilter(cat){activeFilter=cat;document.querySelectorAll('[data-filter]').forEach(b=>b.classList.toggle('active',b.dataset.filter===cat));renderProducts();}
document.addEventListener('click',e=>{let x=e.target.closest('[data-add]');if(x){let id=+x.dataset.add;cart[id]=Math.min(99,(cart[id]||0)+1);renderCart();toast('❤️ Producto agregado al carrito');return}x=e.target.closest('[data-change]');if(x){let id=+x.dataset.change;cart[id]=(cart[id]||0)+Number(x.dataset.delta);if(cart[id]<=0)delete cart[id];renderCart();return}x=e.target.closest('[data-remove]');if(x){delete cart[+x.dataset.remove];renderCart();toast('Producto retirado');return}x=e.target.closest('[data-filter]');if(x){setFilter(x.dataset.filter);return}x=e.target.closest('[data-jump]');if(x){setFilter(x.dataset.jump);$('#catalogo').scrollIntoView({behavior:'smooth'});}});
$('#search').addEventListener('input',e=>{searchTerm=e.target.value.trim().toLowerCase();renderProducts();});
$('#openCart').addEventListener('click',openCart);$('#closeCart').addEventListener('click',closeCart);$('#drawerOverlay').addEventListener('click',closeCart);$('#keepShopping').addEventListener('click',closeCart);$('#goCheckout').addEventListener('click',openCheckout);$('#closeCheckout').addEventListener('click',closeCheckout);$('#checkoutOverlay').addEventListener('click',e=>{if(e.target===$('#checkoutOverlay'))closeCheckout();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(!$('#checkoutOverlay').hidden)closeCheckout();else if($('#cartDrawer').classList.contains('open'))closeCart();}});
$('#menuToggle').addEventListener('click',()=>{const isOpen=$('#nav').classList.toggle('open');$('#menuToggle').textContent=isOpen?'✕':'☰';$('#menuToggle').setAttribute('aria-expanded',isOpen?'true':'false');});$('#nav').querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{$('#nav').classList.remove('open');$('#menuToggle').setAttribute('aria-expanded','false');$('#menuToggle').textContent='☰';}));
$('#shippingProvider').addEventListener('change',()=>{const provider=shippingProvider();$('#shippingProviderNote').textContent=provider==='shalom'?'Shalom: recojo en agencia o punto autorizado si existe cobertura. Monto ilustrativo, no una cotización.':provider==='dhl'?'DHL: exprés/internacional sujeto a cobertura, peso, destino, aduanas y cotización real. El envío se marcará por cotizar.':'Elige un operador para evaluar el envío.';renderCart();renderCheckoutSummary();$('#orderResult').hidden=true;});$('#region').addEventListener('change',e=>updateZone(e.target.value));$('#checkoutZone').addEventListener('change',e=>updateZone(e.target.value));$('#estimateShipping').addEventListener('click',()=>{updateZone($('#region').value);if(!currentZone)toast('Selecciona una zona de envío');});
$('#locateMe').addEventListener('click',()=>{
  if(!navigator.geolocation){$('#shippingResult').textContent='Tu navegador no permite geolocalización. Selecciona tu zona manualmente.';return;}
  $('#shippingResult').textContent='Solicitando permiso de ubicación...';
  navigator.geolocation.getCurrentPosition(
    ({coords})=>{
      const {latitude:lat,longitude:lon}=coords;
      const d=Math.sqrt(Math.pow((lat+12.05)*111,2)+Math.pow((lon+77.05)*108,2));
      if(d<28){updateZone(lon < -77.11 ? 'callao':'lima');$('#shippingResult').textContent+=' Ubicación aproximada detectada; confirma manualmente si corresponde.';}
      else{$('#shippingResult').textContent='Estás fuera del área aproximada de Lima/Callao. Selecciona tu departamento manualmente.';}
    },
    ()=>{$('#shippingResult').textContent='Sin acceso a tu ubicación. Puedes seleccionar la zona manualmente.';},
    {enableHighAccuracy:false,timeout:12000,maximumAge:600000}
  );
});
$('#contactForm').addEventListener('submit',e=>{e.preventDefault();if(!e.currentTarget.reportValidity())return;$('#contactStatus').textContent='✅ Formulario validado. Para recibir mensajes reales necesitas conectar un servicio de formularios o usar tu WhatsApp comercial.';toast('Consulta validada (sin envío real)');});
function whatsappUrl(message){return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;}
$('#checkoutForm').addEventListener('submit',e=>{
 e.preventDefault();
 if(!e.currentTarget.reportValidity())return;
 if(!count()){toast('Tu carrito está vacío');return;}
 const f=new FormData(e.currentTarget),z=String(f.get('zone')||'');updateZone(z);
 const provider=String(f.get('shippingProvider')||'');
 const shippingName=provider==='shalom'?'Shalom — punto de recojo/agencia nacional':provider==='dhl'?'DHL — exprés/internacional':'Por confirmar';
 const content=items().map(({p,qty})=>`• ${p.name} x${qty}: ${money(p.price*qty)}`).join('\n');
 const shippingText=shipment()===null?'A cotizar y confirmar':`${money(shipment())} (ejemplo sin cotización)`;
 const totalText=shipment()===null?`${money(subtotal())} + envío a cotizar`: `${money(subtotal()+shipment())} (ilustrativo)`;
 const t=`Hola, PETLU. Quiero CONSULTAR un pedido (aún sin pagar ni confirmar):\n${content}\nSubtotal referencial: ${money(subtotal())}\nOperador preferido: ${shippingName}\nCosto de envío: ${shippingText}\nTotal orientativo: ${totalText}\nNombre: ${f.get('fullName')}\nTeléfono: ${f.get('phone')}\nDepartamento/zona: ${zones[z]||z}\nDistrito/ciudad: ${f.get('city')}\nDirección: ${f.get('address')}\nPago preferido: ${f.get('payment')}\nPor favor confirmen disponibilidad, precio final, modalidad de entrega y forma de pago.`;
 $('#orderText').value=t;$('#orderResult').hidden=false;
 $('#checkoutStatus').textContent='Resumen listo. Pulsa «Enviar consulta por WhatsApp» para abrir la conversación y enviarlo tú.';
 const a=$('#sendWhatsApp');a.href=whatsappUrl(t);a.target='_blank';a.rel='noopener noreferrer';a.textContent='Enviar consulta por WhatsApp ↗';a.removeAttribute('onclick');
 $('#orderResult').scrollIntoView({behavior:'smooth',block:'nearest'});
});
$('#checkoutForm').addEventListener('input',()=>{$('#orderResult').hidden=true;});$('#checkoutForm').addEventListener('change',()=>{$('#orderResult').hidden=true;});
$('#copyOrder').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('#orderText').value);toast('Resumen copiado');}catch(e){$('#orderText').select();toast('Selecciona el texto y cópialo');}});
$('#whatsappFloat').href=whatsappUrl('¡Hola, PETLU! Quisiera consultar por un producto.');$('#whatsappFloat').target='_blank';$('#whatsappFloat').rel='noopener noreferrer';
$('#year').textContent=new Date().getFullYear();loadCart();renderProducts();renderCart();
