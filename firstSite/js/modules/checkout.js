import { formatCPF, formatPhone, formatCard, formatDate, formatCEP } from '../utils/formatters.js';
import { scrollManager } from '../core/scroll.js';

export const initCheckout = () => {
  const cartCounter = document.getElementById('cart-counter');
  const buyNowBtn = document.getElementById('buy-now-btn');
  const cartIconBtn = document.getElementById('cart-icon-btn');
  const checkoutModal = document.getElementById('checkout-modal');
  const checkoutOverlay = document.getElementById('checkout-overlay');
  const checkoutPanel = document.getElementById('checkout-panel');
  const closeModalBtn = document.getElementById('close-modal-btn');
  const checkoutTotal = document.getElementById('checkout-total');

  const checkoutFormState = document.getElementById('checkout-form-state');
  const checkoutForm = document.getElementById('checkout-form');
  const checkoutSuccessState = document.getElementById('checkout-success-state');
  const successOkBtn = document.getElementById('success-ok-btn');
  const checkoutBody = document.getElementById('checkout-body');

  const cpfInput = document.getElementById('cpf-input');
  const telInput = document.getElementById('tel-input');
  const cepInput = document.getElementById('cep-input');
  const cartaoInput = document.getElementById('cartao-input');
  const validadeInput = document.getElementById('validade-input');
  const cvvInput = document.getElementById('cvv-input');
  const ruaInput = document.getElementById('rua-input');
  const cidadeInput = document.getElementById('cidade-input');
  const estadoInput = document.getElementById('estado-input');

  let currentCount = 0;
  const unitPrice = 299;

  // --- MÁSCARAS ---
  if (cpfInput) cpfInput.addEventListener('input', (e) => e.target.value = formatCPF(e.target.value));
  if (telInput) telInput.addEventListener('input', (e) => e.target.value = formatPhone(e.target.value));
  if (cartaoInput) cartaoInput.addEventListener('input', (e) => e.target.value = formatCard(e.target.value));
  if (validadeInput) validadeInput.addEventListener('input', (e) => e.target.value = formatDate(e.target.value));
  if (cvvInput) {
    cvvInput.addEventListener('input', (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if (v.length > 3) v = v.slice(0, 3);
      e.target.value = v;
    });
  }

  // --- VIACEP API ---
  if (cepInput) {
    cepInput.addEventListener('input', (e) => {
      e.target.value = formatCEP(e.target.value);
      let v = e.target.value.replace(/\D/g, '');
      if (v.length === 8) {
        fetch(`https://viacep.com.br/ws/${v}/json/`)
          .then(res => res.json())
          .then(data => {
            if (!data.erro) {
              if (ruaInput) ruaInput.value = data.logradouro;
              if (cidadeInput) cidadeInput.value = data.localidade;
              if (estadoInput) estadoInput.value = data.uf;
            }
          })
          .catch(err => console.error('Erro ao buscar CEP:', err));
      }
    });
  }

  // --- CARRINHO ---
  const qtyMinus = document.getElementById('qty-minus');
  const qtyPlus = document.getElementById('qty-plus');
  const checkoutQty = document.getElementById('checkout-qty');

  function updateTotal() {
    if (checkoutTotal) checkoutTotal.textContent = `R$ ${currentCount * unitPrice},00`;
    if (checkoutQty) checkoutQty.textContent = currentCount;
    if (cartCounter) {
      cartCounter.textContent = currentCount;
      cartCounter.classList.toggle('opacity-0', currentCount <= 0);
      cartCounter.classList.toggle('opacity-100', currentCount > 0);
    }
  }

  if (qtyMinus) qtyMinus.addEventListener('click', () => { if (currentCount > 0) { currentCount--; updateTotal(); } });
  if (qtyPlus) qtyPlus.addEventListener('click', () => { currentCount++; updateTotal(); });

  // --- MODAL ---
  function openModal() {
    updateTotal();
    if (!checkoutModal) return;
    checkoutModal.classList.remove('hidden');
    document.documentElement.classList.add('overflow-hidden');
    document.body.classList.add('overflow-hidden');
    scrollManager.stop();

    requestAnimationFrame(() => {
      checkoutOverlay.classList.remove('opacity-0');
      checkoutPanel.classList.remove('translate-x-full');
    });
  }

  function closeModal() {
    if (!checkoutModal) return;
    checkoutOverlay.classList.add('opacity-0');
    checkoutPanel.classList.add('translate-x-full');

    setTimeout(() => {
      checkoutModal.classList.add('hidden');
      document.documentElement.classList.remove('overflow-hidden');
      document.body.classList.remove('overflow-hidden');
      scrollManager.start();
    }, 500);
  }

  if (buyNowBtn) {
    buyNowBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (currentCount === 0) currentCount = 1;
      updateTotal();
      gsap.fromTo(cartCounter, { scale: 0.9, y: 5 }, { scale: 1, y: 0, duration: 0.5, ease: "elastic.out(1, 0.3)" });
      openModal();
    });
  }

  if (cartIconBtn) cartIconBtn.addEventListener('click', openModal);
  if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
  if (checkoutOverlay) checkoutOverlay.addEventListener('click', closeModal);

  // --- SUBMIT ---
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', (e) => {
      e.preventDefault();
      checkoutFormState.classList.add('opacity-0', 'pointer-events-none');
      checkoutSuccessState.classList.remove('opacity-0', 'pointer-events-none');
      if (checkoutBody) checkoutBody.scrollTop = 0;
    });
  }

  if (successOkBtn) {
    successOkBtn.addEventListener('click', () => {
      currentCount = 0;
      updateTotal();
      closeModal();
      setTimeout(() => {
        checkoutForm.reset();
        checkoutFormState.classList.remove('opacity-0', 'pointer-events-none');
        checkoutSuccessState.classList.add('opacity-0', 'pointer-events-none');
      }, 500);
    });
  }
};
