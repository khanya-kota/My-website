/* Green Roots Organics - Part 3 JavaScript functionality. */
"use strict";
document.addEventListener("DOMContentLoaded", () => {
 const menuButton=document.querySelector(".menu-toggle");
 const navigation=document.querySelector(".site-nav");
 if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const open=navigation.classList.toggle("is-open");menuButton.setAttribute("aria-expanded",String(open));menuButton.textContent=open?"Close":"Menu";});}
 const grid=document.querySelector("#product-grid");
 if(grid){
  const cards=Array.from(grid.querySelectorAll(".product-card"));
  const search=document.querySelector("#product-search");
  const sort=document.querySelector("#product-sort");
  const filters=Array.from(document.querySelectorAll(".filter-button"));
  const count=document.querySelector("#product-count");
  const empty=document.querySelector("#no-products");
  let activeFilter="all";
  function updateProducts(){
   const term=(search?.value||"").trim().toLowerCase();
   const visible=[];
   cards.forEach(card=>{const matchCategory=activeFilter==="all"||card.dataset.category===activeFilter;const matchSearch=card.textContent.toLowerCase().includes(term);card.hidden=!(matchCategory&&matchSearch);if(!card.hidden)visible.push(card);});
   const order=sort?.value||"default";
   visible.sort((a,b)=>order==="az"?a.dataset.name.localeCompare(b.dataset.name):order==="za"?b.dataset.name.localeCompare(a.dataset.name):cards.indexOf(a)-cards.indexOf(b));
   visible.forEach(card=>grid.appendChild(card));
   if(count)count.textContent="Showing "+visible.length+" of "+cards.length+" products";
   if(empty)empty.hidden=visible.length!==0;
  }
  search?.addEventListener("input",updateProducts);sort?.addEventListener("change",updateProducts);
  filters.forEach(button=>button.addEventListener("click",()=>{activeFilter=button.dataset.filter;filters.forEach(item=>{const selected=item===button;item.classList.toggle("active",selected);item.setAttribute("aria-pressed",String(selected));});updateProducts();}));
  updateProducts();
 }
 const lightbox=document.querySelector("#image-lightbox");
 const lightboxImage=document.querySelector("#lightbox-image");
 const closeLightbox=document.querySelector(".lightbox-close");
 let previousFocus=null;
 document.querySelectorAll("[data-lightbox]").forEach(button=>button.addEventListener("click",()=>{if(!lightbox||!lightboxImage)return;previousFocus=document.activeElement;lightboxImage.src=button.dataset.lightbox;lightboxImage.alt=button.dataset.alt||"Product photograph";lightbox.hidden=false;closeLightbox?.focus();}));
 function hideLightbox(){if(!lightbox)return;lightbox.hidden=true;if(lightboxImage)lightboxImage.src="";previousFocus?.focus();}
 closeLightbox?.addEventListener("click",hideLightbox);
 lightbox?.addEventListener("click",event=>{if(event.target===lightbox)hideLightbox();});
 document.addEventListener("keydown",event=>{if(event.key==="Escape"&&lightbox&&!lightbox.hidden)hideLightbox();});
 const enquiryForm=document.querySelector("#enquiry-form");
 if(enquiryForm){
  enquiryForm.noValidate=true;
  const product=new URLSearchParams(window.location.search).get("product");
  if(product){const message=enquiryForm.querySelector("#message");if(message)message.value="I would like to enquire about "+product+". ";}
  const validateEnquiry=()=>{
   const feedback=document.querySelector("#enquiry-feedback");
   const name=enquiryForm.querySelector("#name").value.trim();
   const email=enquiryForm.querySelector("#email").value.trim();
   const phone=enquiryForm.querySelector("#phone").value.trim();
   const enquiry=enquiryForm.querySelector("#enquiry").value;
   const area=enquiryForm.querySelector("#area").value.trim();
   const message=enquiryForm.querySelector("#message").value.trim();
   let error="";
   if(!name||!email||!phone||!enquiry||!area||!message) error="Please complete this field.";
   else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) error="Please enter a valid email address.";
   else if(!/^[0-9+() -]{7,20}$/.test(phone)) error="Please enter a valid phone number.";
   else if(message.length<10) error="Please enter at least 10 characters in your enquiry.";
   if(error){const firstMissing=[["#name",name],["#email",email],["#phone",phone],["#enquiry",enquiry],["#area",area],["#message",message]].find(([,value])=>!value);if(firstMissing)enquiryForm.querySelector(firstMissing[0])?.focus();}
   if(feedback) feedback.textContent=error||"Thank you. Your enquiry details have been checked. Current seasonal availability, pricing and delivery options must be confirmed by Green Roots Organics before an order can be finalised.";
   if(!error) enquiryForm.reset();
  };
  enquiryForm.addEventListener("submit",event=>event.preventDefault());
  enquiryForm.querySelector(".submit-button")?.addEventListener("click",event=>{event.preventDefault();validateEnquiry();});
 }
 const contactForm=document.querySelector("#contact-form");
 if(contactForm){
  // Disable browser validation bubbles and show errors within the page.
  contactForm.noValidate=true;
  const businessEmail="YOUR_BUSINESS_EMAIL@example.com";
  contactForm.querySelector(".submit-button")?.addEventListener("click",event=>{
   event.preventDefault();
   const feedback=document.querySelector("#contact-feedback");
   const name=contactForm.querySelector("#contact-name").value.trim();
   const email=contactForm.querySelector("#contact-email").value.trim();
   const phone=contactForm.querySelector("#contact-phone").value.trim();
   const messageType=contactForm.querySelector("#message-type").value;
   const message=contactForm.querySelector("#contact-message").value.trim();
   let error="";
   if(!name||!email||!messageType||!message){
    error="Please complete this field.";
   }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)){
    error="Please enter a valid email address.";
   }else if(phone&&!/^[0-9+() -]{7,20}$/.test(phone)){
    error="Please enter a valid phone number or leave this field blank.";
   }else if(message.length<10){
    error="Please enter at least 10 characters in your message.";
   }
   if(error){
    const firstMissing=[["#contact-name",name],["#contact-email",email],["#message-type",messageType],["#contact-message",message]].find(([,value])=>!value);
    if(firstMissing)contactForm.querySelector(firstMissing[0])?.focus();
    if(feedback)feedback.textContent=error;
    return;
   }
   if(businessEmail==="YOUR_BUSINESS_EMAIL@example.com"){
    if(feedback)feedback.textContent="Your message is valid, but the business email address has not been configured yet. Add the correct address in Assets/js/script.js before publishing.";
    return;
   }
   const data=new FormData(contactForm);
   const subject=encodeURIComponent("Green Roots Organics - "+data.get("messageType"));
   const body=encodeURIComponent("Name: "+data.get("name")+"\nEmail: "+data.get("email")+"\nPhone: "+(data.get("phone")||"Not supplied")+"\nMessage type: "+data.get("messageType")+"\n\nMessage:\n"+data.get("message"));
   window.location.href="mailto:"+businessEmail+"?subject="+subject+"&body="+body;
   if(feedback)feedback.textContent="Your email application should open with your message ready to review and send.";
  });
 }
});
