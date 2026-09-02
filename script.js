// 1. Configuração do Supabase
const SUPABASE_URL = 'https://alfcbkalxhapiyazlbam.supabase.co';
const SUPABASE_KEY = 'sb_publishable_ThnL5hKJsF5cOUNniF8p4g_LoJOyc5f';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// 2. Função para salvar o orçamento no banco de dados e enviar para a Google Planilha
async function enviarOrcamento(event) {
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const telefone = document.getElementById('telefone').value;
  const servico = document.getElementById('servico').value;
  const placa = document.getElementById('placa') ? document.getElementById('placa').value : '';
  const mensagem = document.getElementById('mensagem') ? document.getElementById('mensagem').value : '';

  // 1. Envia para o Supabase
  const { data, error } = await supabaseClient
    .from('orcamentos')
    .insert([
      {
        nome_cliente: nome,
        telefone: telefone,
        servico: servico,
        placa: placa,
        mensagem: mensagem
      }
    ]);

  // 2. Envia simultaneamente para a Google Planilha
  const URL_GOOGLE_WEBHOOK = 'https://script.google.com/macros/s/AKfycbw8F1o4NlZNIAR2taaNUry5wtMcfrXhRu2h0kzfhjkzfSuyBgWfQ1HA88aMQyNzgM_EeQ/exec';

  try {
    fetch(URL_GOOGLE_WEBHOOK, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
    nome: nome,
     telefone: telefone,
     servico: servico,
      placa: placa,
      mensagem: mensagem
    })

    });
  } catch (err) {
    console.error('Erro ao enviar para a Planilha:', err);
  }

  // 3. Resposta ao cliente
  if (error) {
    console.error('Erro ao enviar orçamento:', error);
    alert('Erro ao enviar: ' + (error.message || 'Verifique o console'));
  } else {
    alert('Orçamento enviado com sucesso! Entraremos em contato em breve.');
    document.getElementById('form-orcamento').reset();
  }
}

// 3. Animação de Entrada e Saída na Rolagem (Sobe e Desce)
function inicializarAnimacoes() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      } else {
        entry.target.classList.remove('active');
      }
    });
  }, { 
    threshold: 0.30,                        // Exige 25% da seção visível para ativar
    rootMargin: "0px 0px -128px 0px"        // Esconde até que suba 128px para dentro da tela
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

// 4. Executa assim que a página é carregada
document.addEventListener('DOMContentLoaded', () => {
  // Ativa as animações
  inicializarAnimacoes();

  // Conecta o formulário de orçamento
  const form = document.getElementById('form-orcamento');
  if (form) {
    form.addEventListener('submit', enviarOrcamento);
  }
});

// Controle do Menu Mobile (executado após o carregamento)
document.addEventListener('DOMContentLoaded', () => {
  const btnMenu = document.querySelector('.menu-toggle') || document.querySelector('.hamburger') || document.querySelector('.header button');
  const menuNav = document.querySelector('.nav-menu') || document.querySelector('.nav-list') || document.querySelector('nav');

  if (btnMenu && menuNav) {
    btnMenu.addEventListener('click', () => {
      menuNav.classList.toggle('active');
    });
  }
});

// Função para consultar o VALOR do orçamento retornado pela planilha
async function buscarValorOrcamento() {
  const nome = document.getElementById('orcamento-nome') ? document.getElementById('orcamento-nome').value.trim() : '';
  const telInput = document.getElementById('orcamento-tel') || document.getElementById('consulta-tel-orcamento');
  const resDiv = document.getElementById('resultado-valor-orcamento');

  if (!telInput || !telInput.value.trim()) {
    alert('Por favor, preencha o seu telefone com DDD.');
    return;
  }

  const tel = telInput.value.replace(/\D/g, '');
  const URL_WEBHOOK = 'https://script.google.com/macros/s/AKfycbw8F1o4NlZNIAR2taaNUry5wtMcfrXhRu2h0kzfhjkzfSuyBgWfQ1HA88aMQyNzgM_EeQ/exec';

  try {
    const response = await fetch(`${URL_WEBHOOK}?acao=obterValorOrcamento&busca=${encodeURIComponent(tel)}`);
    const data = await response.json();

    if (data.status === 'sucesso' && data.encontrado) {
      if (document.getElementById('val-orcamento')) {
        document.getElementById('val-orcamento').innerText = data.valor || 'Em análise pela oficina';
      }
      if (document.getElementById('val-obs')) {
        document.getElementById('val-obs').innerText = data.observacao || 'Sem observações adicionais.';
      }
      if (resDiv) resDiv.style.display = 'block';
    } else {
      alert('Nenhum orçamento encontrado para esses dados.');
      if (resDiv) resDiv.style.display = 'none';
    }
  } catch (err) {
    console.error('Erro na consulta:', err);
    alert('Erro ao consultar o valor. Tente novamente.');
  }
}


// Fecha o menu hambúrguer automaticamente ao clicar em qualquer link
document.addEventListener('DOMContentLoaded', () => {
  const navMenu = document.querySelector('.nav-menu');
  const menuToggle = document.querySelector('.mobile-menu-toggle');
  const navLinks = document.querySelectorAll('.nav-link, .btn-menu-orcamento');

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      // Remove as classes de menu aberto (ajuste os nomes se no seu script for diferente)
      if (navMenu) navMenu.classList.remove('active');
      if (menuToggle) menuToggle.classList.remove('open');
    });
  });
});

