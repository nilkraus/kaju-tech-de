document.addEventListener('DOMContentLoaded', function() {
    // ===== PARTE 1: GERENCIAMENTO DE NAVEGAÇÃO E ANIMAÇÕES =====
    const navLinks = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    
    // Atualiza o link ativo de navegação
    function updateActiveLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (window.pageYOffset >= sectionTop - 200 && window.pageYOffset < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href && href.startsWith('#') && href.substring(1) === current) {
                link.classList.add('active');
            }
        });
    }
    
    window.addEventListener('scroll', updateActiveLink);
    updateActiveLink(); // Definir o link ativo inicial
    
    // Rolagem suave para os links de navegação
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Verifica se o link é para uma seção na mesma página (começa com #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                
                const targetSection = document.querySelector(href);
                
                if (targetSection) {
                    // Ajusta o offset baseado no tamanho da tela
                    const targetOffset = window.innerWidth <= 767 ? 50 : 70;
                    
                    window.scrollTo({
                        top: targetSection.offsetTop - targetOffset,
                        behavior: 'smooth'
                    });
                }
            }
            // Se não começa com #, deixa o navegador lidar com o link normalmente
        });
    });
    
    // Botão "voltar ao topo"
    const backToTopBtn = document.querySelector('.back-to-top');
    
    // Verificar se o botão de voltar ao topo existe
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function(e) {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Exibir/ocultar o botão baseado na posição do scroll
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.style.display = 'flex';
            } else {
                backToTopBtn.style.display = 'none';
            }
        });
        
        // Inicializar a visibilidade do botão
        backToTopBtn.style.display = 'none';
    }
    
    // Testimonial slider
    const testimonialSlider = document.querySelector('.testimonial-slider');
    const testimonialContainer = document.querySelector('.testimonial-container');
    const testimonialCards = document.querySelectorAll('.testimonial-card');
    const prevBtn = document.querySelector('.testimonial-nav .prev');
    const nextBtn = document.querySelector('.testimonial-nav .next');
    
    if (testimonialSlider && testimonialContainer && prevBtn && nextBtn && testimonialCards.length > 0) {
        let currentIndex = 0;
        
        // Ajusta a largura do card de acordo com o tamanho da tela
        function getCardWidth() {
            // Para telas menores, use uma largura menor
            return window.innerWidth <= 767 ? 300 : 380; // 300px para mobile, 380px para desktop
        }
        
        // Função para recalcular todas as dimensões do slider
        function recalculateSlider() {
            const cardWidth = getCardWidth();
            const sliderWidth = testimonialSlider.offsetWidth;
            const cardsVisible = Math.max(1, Math.floor(sliderWidth / cardWidth));
            const maxIndex = Math.max(0, testimonialCards.length - cardsVisible);
            
            // Ajusta o índice atual se necessário
            if (currentIndex > maxIndex) {
                currentIndex = maxIndex;
            }
            
            // Atualiza a posição do slider
            testimonialContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
            
            return { cardWidth, maxIndex };
        }
        
        function updateSlider() {
            const { cardWidth } = recalculateSlider();
            testimonialContainer.style.transform = `translateX(-${currentIndex * cardWidth}px)`;
        }
        
        nextBtn.addEventListener('click', function() {
            const { maxIndex } = recalculateSlider();
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        });
        
        prevBtn.addEventListener('click', function() {
            const { maxIndex } = recalculateSlider();
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = maxIndex;
            }
            updateSlider();
        });
        
        // Ajustar o slider ao redimensionar a janela
        window.addEventListener('resize', () => {
            recalculateSlider();
        });
        
        // Iniciando o slider
        recalculateSlider();
        
        // Avançar automaticamente no slider de depoimentos
        let sliderInterval = setInterval(function() {
            const { maxIndex } = recalculateSlider();
            if (currentIndex < maxIndex) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateSlider();
        }, 5000);
        
        // Pausar a rotação automática ao passar o mouse
        testimonialContainer.addEventListener('mouseenter', function() {
            clearInterval(sliderInterval);
        });
        
        testimonialContainer.addEventListener('mouseleave', function() {
            sliderInterval = setInterval(function() {
                const { maxIndex } = recalculateSlider();
                if (currentIndex < maxIndex) {
                    currentIndex++;
                } else {
                    currentIndex = 0;
                }
                updateSlider();
            }, 5000);
        });
    }
    
    // Animações de revelação ao rolar
    const animatedSections = document.querySelectorAll('.services, .about, .team, .testimonials, .contact');
    
    const revealSection = function(entries, observer) {
        const [entry] = entries;
        
        if (!entry.isIntersecting) return;
        
        entry.target.style.opacity = 1;
        entry.target.style.transform = 'translateY(0)';
        
        observer.unobserve(entry.target);
    };
    
    const sectionObserver = new IntersectionObserver(revealSection, {
        root: null,
        threshold: 0.15,
    });
    
    animatedSections.forEach(function(section) {
        sectionObserver.observe(section);
        section.style.opacity = 0;
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 1s, transform 1s';
    });

    // ===== PARTE 2: GERENCIAMENTO DE IDIOMAS =====
    const path = window.location.pathname;
    const portuguesLink = document.getElementById('portugues');
    const inglesLink = document.getElementById('ingles');
    const alemaoLink = document.getElementById('alemao');
    const idiomaAtual = document.getElementById('idioma-atual');
    
    if (portuguesLink && inglesLink && alemaoLink && idiomaAtual) {
        // Mapeamento de páginas entre idiomas
        const paginasMapeadas = {
            'sobre-nos.html': {de: 'uber-uns.html', en: 'about-us.html'},
            'fale-conosco.html': {de: 'kontakt.html', en: 'contact.html'},
            'index.html': {de: 'index.html', en: 'index.html'}
        };
        
        // Remove a classe ativa de todos
        portuguesLink.classList.remove('idioma-ativo');
        inglesLink.classList.remove('idioma-ativo');
        alemaoLink.classList.remove('idioma-ativo');
        
        // Extrai o nome do arquivo do caminho
        const filename = path.split('/').pop() || 'index.html';
        
        // Define a classe ativa e idioma atual
        portuguesLink.classList.add('idioma-ativo');
        idiomaAtual.textContent = 'PT';
        
        // Configura links para outros idiomas
        if (paginasMapeadas[filename]) {
            alemaoLink.href = '/' + paginasMapeadas[filename].de;
            inglesLink.href = '/en/' + paginasMapeadas[filename].en;
        } else {
            // Fallback para página index
            alemaoLink.href = '/';
            inglesLink.href = '/en/';
        }
    }
});