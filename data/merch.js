/* =====================================================================
   MERCH – edit this file. Each item can have desc (a paragraph) and details (a list of short lines) for its own page (product.html). price is in TND. soldOut: true greys the item out.
   ORDER_LINK = where the "Place order" button on the cart page sends people
   (an Instagram DM, WhatsApp link, Google Form…). Leave '' to use the Bedroom Records Instagram.
   ===================================================================== */
const M = 'assets/merch/';
window.ORDER_LINK = '';
window.MERCH = [
  { id: 'stickers',  title: 'BEDROOM STICKERS 10PC PACK',                 price: 15,  img: M + 'sticker-pack.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'hoodie',    title: 'I LOVE BEDROOM - BLACK HOODIE',              price: 70,  img: M + 'hoodie.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'calour',    title: 'RAMSJAMSSS LIMITED EDITION CALOUR T-SHIRT',  price: 60,  img: M + 'calour-tee.webp', soldOut: true, desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'stomp-cd',  title: 'STOMP DOUBLE VOLUME MIXTAPE CD',             price: 50,  img: M + 'stomp-cd.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'stomp-tee', title: 'RAMSJAMSSS X FICHIER CACHÉ STOMP T-SHIRT', price: 80,  img: M + 'stomp-tee.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'stations',  title: 'KVMPA STATIONS VINYL',                       price: 70,  img: M + 'stations-vinyl.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'jeans',     title: 'KVMPA BEAUTIFULTRUSH X HAMZA SELLMY JEANS LIMITED EDITION', price: 150, img: M + 'jeans.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
  { id: 'reset-cd',  title: 'DOPEMAN FACTORY RESET CD',                   price: 50,  img: M + 'factory-reset-cd.webp', desc: 'Description coming soon.', details: ['Details coming soon'] },
];
