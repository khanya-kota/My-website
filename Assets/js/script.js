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
   const requiredFields=[
    ["#name","Full name"],["#email","Email address"],["#phone","Phone number"],
    ["#enquiry","Enquiry type"],["#area","Delivery area"],["#message","Your enquiry"]
   ];
   let firstInvalid=null;
   requiredFields.forEach(([selector,label])=>{
    const field=enquiryForm.querySelector(selector);
    const group=field.closest(".form-group");
    let error=document.getElementById(field.id+"-error");
    if(!error){error=document.createElement("small");error.className="field-error";error.id=field.id+"-error";error.setAttribute("aria-live","polite");field.insertAdjacentElement("afterend",error);}
    const empty=!field.value.trim();
    error.textContent=empty?"Please complete this field.":"";
    field.setAttribute("aria-invalid",String(empty));
    if(empty&&!firstInvalid)firstInvalid=field;
   });
   const email=enquiryForm.querySelector("#email");
   if(email.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
    const group=email.closest(".form-group");document.getElementById(email.id+"-error").textContent="Please enter a valid email address.";email.setAttribute("aria-invalid","true");firstInvalid=firstInvalid||email;
   }
   const phone=enquiryForm.querySelector("#phone");
   if(phone.value.trim()&&!/^[0-9+() -]{7,20}$/.test(phone.value.trim())){
    const group=phone.closest(".form-group");document.getElementById(phone.id+"-error").textContent="Please enter a valid phone number.";phone.setAttribute("aria-invalid","true");firstInvalid=firstInvalid||phone;
   }
   const message=enquiryForm.querySelector("#message");
   if(message.value.trim()&&message.value.trim().length<10){
    const group=message.closest(".form-group");group.querySelector(".field-error").textContent="Please enter at least 10 characters.";message.setAttribute("aria-invalid","true");firstInvalid=firstInvalid||message;
   }
   if(feedback)feedback.textContent=firstInvalid?"":"Thank you. Your enquiry details have been checked. Current seasonal availability, pricing and delivery options must be confirmed by Green Roots Organics before an order can be finalised.";
   if(firstInvalid){firstInvalid.focus();return;}
   enquiryForm.reset();
  };
  enquiryForm.addEventListener("submit",event=>event.preventDefault());
  enquiryForm.querySelector(".submit-button")?.addEventListener("click",event=>{event.preventDefault();validateEnquiry();});
 }
 const contactForm=document.querySelector("#contact-form");
 if(contactForm){
  // Disable browser validation bubbles and show errors within the page.
  contactForm.noValidate=true;
  const businessEmail="YOUR_BUSINESS_EMAIL@example.com";
  const validateContact=()=>{
   const feedback=document.querySelector("#contact-feedback");
   const requiredFields=[
    ["#contact-name","Full name"],["#contact-email","Email address"],
    ["#message-type","Message type"],["#contact-message","Full message"]
   ];
   let firstInvalid=null;
   requiredFields.forEach(([selector])=>{
    const field=contactForm.querySelector(selector);
    const group=field.closest(".form-group");
    let error=document.getElementById(field.id+"-error");
    if(!error){error=document.createElement("small");error.className="field-error";error.id=field.id+"-error";error.setAttribute("aria-live","polite");field.insertAdjacentElement("afterend",error);}
    const empty=!field.value.trim();
    error.textContent=empty?"Please complete this field.":"";
    field.setAttribute("aria-invalid",String(empty));
    if(empty&&!firstInvalid)firstInvalid=field;
   });
   const email=contactForm.querySelector("#contact-email");
   if(email.value.trim()&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){
    document.getElementById(email.id+"-error").textContent="Please enter a valid email address.";email.setAttribute("aria-invalid","true");firstInvalid=firstInvalid||email;
   }
   const phone=contactForm.querySelector("#contact-phone");
   let phoneError=document.getElementById(phone.id+"-error");
   if(!phoneError){phoneError=document.createElement("small");phoneError.className="field-error";phone.closest(".form-group").appendChild(phoneError);}
   phoneError.textContent=phone.value.trim()&&!/^[0-9+() -]{7,20}$/.test(phone.value.trim())?"Please enter a valid phone number or leave this field blank.":"";
   if(phoneError.textContent){phone.setAttribute("aria-invalid","true");firstInvalid=firstInvalid||phone;}else phone.setAttribute("aria-invalid","false");
   const message=contactForm.querySelector("#contact-message");
   if(message.value.trim()&&message.value.trim().length<10){
    document.getElementById(message.id+"-error").textContent="Please enter at least 10 characters.";message.setAttribute("aria-invalid","true");firstInvalid=firstInvalid||message;
   }
   if(feedback)feedback.textContent="";
   if(firstInvalid){firstInvalid.focus();return;}
   const businessEmail="YOUR_BUSINESS_EMAIL@example.com";
   if(businessEmail==="YOUR_BUSINESS_EMAIL@example.com"){
    if(feedback)feedback.textContent="Your message is valid, but the business email address has not been configured yet.";
    return;
   }
   const data=new FormData(contactForm);
   const subject=encodeURIComponent("Green Roots Organics - "+data.get("messageType"));
   const body=encodeURIComponent("Name: "+data.get("name")+"\\nEmail: "+data.get("email")+"\\nPhone: "+(data.get("phone")||"Not supplied")+"\\nMessage type: "+data.get("messageType")+"\\n\\nMessage:\\n"+data.get("message"));
   window.location.href="mailto:"+businessEmail+"?subject="+subject+"&body="+body;
   if(feedback)feedback.textContent="Your email application should open with your message ready to review and send.";
  };
  contactForm.addEventListener("submit",event=>{event.preventDefault();validateContact();});
  contactForm.querySelector(".submit-button")?.addEventListener("click",event=>{event.preventDefault();validateContact();});
 }
});
