// Custom cursor
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursorRing');
  let mx = 0, my = 0, rx = 0, ry = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12; ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.querySelectorAll('a, button, .skill-category, .project-card, .cert-card').forEach(el => {
    el.addEventListener('mouseenter', () => { cursor.classList.add('hovering'); ring.classList.add('hovering'); });
    el.addEventListener('mouseleave', () => { cursor.classList.remove('hovering'); ring.classList.remove('hovering'); });
  });

  // Navbar scroll
  const navbar = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  // Mobile nav
  document.getElementById('hamburger').addEventListener('click', () => {
    document.getElementById('mobileNav').classList.add('open');
  });
  document.getElementById('closeNav').addEventListener('click', () => {
    document.getElementById('mobileNav').classList.remove('open');
  });
  function closeMobileNav() { document.getElementById('mobileNav').classList.remove('open'); }

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => { entry.target.classList.add('visible'); }, i * 80);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  reveals.forEach(el => observer.observe(el));

  // Animated counter with easing
  function animateCounter(el, target, decimals = 0, suffix = '') {
    let start = null; const duration = 2000;
    const step = timestamp => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const val = easeOutQuart * target;
      el.textContent = (decimals ? val.toFixed(decimals) : Math.floor(val)) + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = (decimals ? target.toFixed(decimals) : target) + suffix;
      }
    };
    requestAnimationFrame(step);
  }

  const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const nums = entry.target.querySelectorAll('.stat-num');
        nums.forEach(n => {
          const target = parseFloat(n.getAttribute('data-target') || 0);
          const decimals = parseInt(n.getAttribute('data-decimals') || 0);
          const suffix = n.getAttribute('data-suffix') || '';
          animateCounter(n, target, decimals, suffix);
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) statsObserver.observe(heroStats);

  // GitHub Repos Fetcher
  async function fetchGitHubRepos() {
    const username = 'mounikay845-source';
    const container = document.getElementById('github-grid');
    if (!container) return;

    try {
      const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
      if (!response.ok) throw new Error('Network response was not ok');
      const repos = await response.json();
      
      if(repos.length === 0) {
        container.innerHTML = '<p style="color: var(--muted)">No public repositories found.</p>';
        return;
      }

      const reposHTML = repos.map(repo => `
        <a href="${repo.html_url}" target="_blank" style="text-decoration:none;" class="project-card reveal visible">
          <div class="project-body" style="height:100%">
            <div class="project-tech">
              ${repo.language ? `<span class="tech-badge">${repo.language}</span>` : ''}
              <span class="tech-badge" style="background:rgba(255,255,255,0.05);color:var(--muted);border:none;">⭐ ${repo.stargazers_count}</span>
            </div>
            <div class="project-title" style="color:var(--text); font-size:1.1rem; margin-top:0.5rem; word-break:break-all;">${repo.name}</div>
            <div class="project-desc" style="margin-top:0.5rem;">${repo.description || 'Check out my code on GitHub.'}</div>
          </div>
        </a>
      `).join('');
      
      container.innerHTML = reposHTML;
      
    } catch (error) {
      console.error('Error fetching repos:', error);
      container.innerHTML = '<p style="color: var(--muted)">Failed to load GitHub repositories.</p>';
    }
  }

  document.addEventListener('DOMContentLoaded', fetchGitHubRepos);
