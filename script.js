tailwind.config = {
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
            colors: {
                vortex: {
                    bg: '#0b0f19',
                    panel: '#131b2e',
                    card: '#18233c',
                    border: '#233252',
                    cyan: '#00f2fe',
                    pink: '#ff007f',
                    purple: '#7928ca'
                }
            },
            boxShadow: {
                'cyan-glow': '0 0 25px -5px rgba(0, 242, 254, 0.4)',
                'pink-glow': '0 0 25px -5px rgba(255, 0, 127, 0.4)',
                'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.6)',
            }
        }
    }
};

const platforms = [
    {
        name: 'XXX.com',
        category: 'Tube',
        url: 'https://xxx.com',
        desc: 'High quality adult videos, daily original uploads, and premium stream channels.',
        tags: ['4K Ultra HD', 'Fast Stream', 'Mobile Ready'],
        rating: '4.9/5'
    },
    {
        name: 'XNXX',
        category: 'Tube',
        url: 'https://xnxx.com',
        desc: 'Massive directory of free tube clips, trending video categories, and mobile streams.',
        tags: ['Trending Clips', 'Low Data Mode', 'Free Access'],
        rating: '4.8/5'
    },
    {
        name: 'xHamster',
        category: 'Streams',
        url: 'https://xhamster.com',
        desc: 'Global adult video portal featuring full length HD clips and live community streams.',
        tags: ['Live Streams', 'Full HD', 'Fast Proxy'],
        rating: '4.9/5'
    },
    {
        name: 'Mat6Tube',
        category: 'Tube',
        url: 'https://mat6tube.com',
        desc: 'Online tube indexing platform for fast streaming across various adult categories.',
        tags: ['Tube Index', 'Fast Load', 'Proxy Ready'],
        rating: '4.6/5'
    },
    {
        name: 'RedTube',
        category: 'HD',
        url: 'https://redtube.com',
        desc: 'Popular adult media platform with high bitrate streaming and verified creator channels.',
        tags: ['1080p HD', 'Official Channels', 'Zero Ads Proxy'],
        rating: '4.7/5'
    },
    {
        name: 'SpankBang',
        category: 'HD',
        url: 'https://spankbang.com',
        desc: '4K adult media search engine offering high speed playback and curated playlists.',
        tags: ['4K Quality', 'High Speed', 'Bypass Ready'],
        rating: '4.9/5'
    }
];

const customSitesStorageKey = 'vortex-custom-sites';

function loadCustomPlatforms() {
    try {
        const savedPlatforms = JSON.parse(localStorage.getItem(customSitesStorageKey) || '[]');
        if (!Array.isArray(savedPlatforms)) return [];

        return savedPlatforms.filter(site => {
            if (!site || typeof site.name !== 'string' || typeof site.desc !== 'string' || !Array.isArray(site.tags)) return false;
            if (!['Tube', 'HD', 'Streams'].includes(site.category)) return false;

            try {
                return ['http:', 'https:'].includes(new URL(site.url).protocol);
            } catch {
                return false;
            }
        }).map(site => ({ ...site, custom: true }));
    } catch {
        return [];
    }
}

const customPlatforms = loadCustomPlatforms();
platforms.push(...customPlatforms);

let activeCategory = 'All';

const getElement = (id) => document.getElementById(id);

function escapeHTML(value) {
    return String(value).replace(/[&<>"']/g, character => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
    })[character]);
}

function renderAddSiteCard(grid) {
    const addSiteCard = document.createElement('button');
    addSiteCard.type = 'button';
    addSiteCard.setAttribute('aria-label', 'Add site');
    addSiteCard.className = 'glass-card p-6 rounded-2xl min-h-56 flex flex-col items-center justify-center gap-3 text-vortex-cyan border-dashed transition';
    addSiteCard.innerHTML = '<i class="fa-solid fa-circle-plus text-4xl" aria-hidden="true"></i><span class="text-sm font-bold">Add Site</span>';
    addSiteCard.addEventListener('click', openAddSiteModal);
    grid.append(addSiteCard);
}

function renderSiteMenu() {
    const menu = getElement('siteMenuOptions');
    const siteMenu = getElement('siteMenu');
    if (!menu || !siteMenu) return;

    const siteLinks = platforms.map(site => `
        <a href="${escapeHTML(site.url)}" target="_blank" rel="noopener noreferrer" class="flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-gray-200 hover:bg-vortex-cyan/10 hover:text-vortex-cyan transition">
            <i class="fa-solid fa-globe text-vortex-cyan" aria-hidden="true"></i>${escapeHTML(site.name)}
        </a>
    `).join('');

    menu.innerHTML = `${siteLinks}
        <a href="vortex_search_engine.html" class="mt-1 flex items-center gap-2 border-t border-white/10 px-3 py-2.5 text-xs font-bold text-vortex-cyan hover:bg-vortex-cyan/10 transition">
            <i class="fa-solid fa-layer-group" aria-hidden="true"></i> View All Sites
        </a>
    `;

    siteMenu.addEventListener('click', event => {
        if (event.target.closest('a')) siteMenu.removeAttribute('open');
    });
}

function renderPlatforms(list) {
    const grid = getElement('resultsGrid');
    if (!grid) return;

    grid.innerHTML = '';

    if (list.length === 0) {
        grid.innerHTML = `
            <div class="col-span-full py-12 text-center text-gray-500 space-y-3">
                <i class="fa-solid fa-magnifying-glass-slash text-4xl text-vortex-cyan/50"></i>
                <p class="text-base font-semibold">No platforms matching your search.</p>
            </div>
        `;
        renderAddSiteCard(grid);
        return;
    }

    list.forEach(site => {
        const tagHTML = site.tags.map(t =>
            `<span class="text-[10px] bg-slate-900 text-vortex-cyan border border-vortex-cyan/20 px-2 py-0.5 rounded-full font-mono">${escapeHTML(t)}</span>`
        ).join(' ');

        grid.innerHTML += `
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 relative group">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="flex items-center gap-2 text-xl font-extrabold text-white group-hover:text-vortex-cyan transition">
                            <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-slate-900">
                                <img src="https://www.google.com/s2/favicons?domain_url=${encodeURIComponent(site.url)}&sz=64" alt="" loading="lazy" class="h-6 w-6 rounded object-contain" onerror="this.remove(); this.nextElementSibling.classList.remove('hidden')">
                                <i class="fa-solid fa-globe text-vortex-cyan hidden" aria-hidden="true"></i>
                            </span>${escapeHTML(site.name)}
                        </h3>
                        <span class="text-xs bg-vortex-pink/20 text-vortex-pink border border-vortex-pink/30 px-2.5 py-1 rounded-lg font-bold">${escapeHTML(site.category)}</span>
                    </div>

                    <p class="text-xs text-gray-400 leading-relaxed">${escapeHTML(site.desc)}</p>

                    <div class="flex flex-wrap gap-1.5 pt-1">
                        ${tagHTML}
                    </div>
                </div>

                <div class="pt-4 border-t border-white/10 flex flex-col gap-2">
                    <button type="button" data-proxy-url="${escapeHTML(site.url)}" data-proxy-name="${escapeHTML(site.name)}" class="w-full btn-cyan-gradient text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md">
                        <i class="fa-solid fa-shield-halved"></i> Open via Vortex Proxy
                    </button>

                    <a href="${escapeHTML(site.url)}" target="_blank" rel="noopener noreferrer" class="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/10 transition">
                        Direct Link <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                </div>
            </div>
        `;
    });

    renderAddSiteCard(grid);
}

function openAddSiteModal() {
    const modal = getElement('addSiteModal');
    if (!modal) return;

    modal.classList.remove('hidden');
    modal.querySelector('[name="name"]')?.focus();
}

function closeAddSiteModal() {
    const modal = getElement('addSiteModal');
    if (modal) modal.classList.add('hidden');
}

function addSite(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);
    let parsedURL;
    try {
        parsedURL = new URL(formData.get('url'));
    } catch {
        form.elements.namedItem('url').setCustomValidity('Enter a valid website URL.');
        form.reportValidity();
        return;
    }

    if (!['http:', 'https:'].includes(parsedURL.protocol)) {
        const urlInput = form.elements.namedItem('url');
        urlInput.setCustomValidity('Use a website URL that starts with http:// or https://.');
        form.reportValidity();
        return;
    }

    const newSite = {
        name: formData.get('name').trim(),
        category: formData.get('category'),
        url: parsedURL.href,
        desc: formData.get('desc').trim(),
        tags: formData.get('tags').split(',').map(tag => tag.trim()).filter(Boolean),
        rating: 'New',
        custom: true
    };
    platforms.push(newSite);
    customPlatforms.push(newSite);
    try {
        localStorage.setItem(customSitesStorageKey, JSON.stringify(customPlatforms));
    } catch { }

    form.reset();
    getElement('searchInput').value = '';
    closeAddSiteModal();
    setCategory('All');
}

function filterResults() {
    const filtered = platforms.filter(p => (activeCategory === 'All') || (p.category === activeCategory));
    renderPlatforms(filtered);
}

function setCategory(category) {
    activeCategory = category;

    ['catAll', 'catTube', 'catHD', 'catStreams'].forEach(id => {
        const btn = getElement(id);
        if (btn) {
            btn.className = 'px-3.5 py-1.5 rounded-xl bg-vortex-panel hover:bg-vortex-card text-gray-300 border border-white/10 transition';
        }
    });

    const categoryButton = getElement(`cat${category === 'All' ? 'All' : category}`);
    if (categoryButton) {
        categoryButton.className = 'px-3.5 py-1.5 rounded-xl bg-vortex-cyan text-slate-950 font-bold transition';
    }

    filterResults();
}

function clearSearch() {
    const searchInput = getElement('searchInput');
    if (!searchInput) return;

    searchInput.value = '';
    filterResults();
}

function openProxyViewer(url, name) {
    const modal = getElement('proxyModal');
    const modalTitle = getElement('proxyModalTitle');
    const modalUrl = getElement('proxyModalUrl');
    const proxyPlatformName = getElement('proxyPlatformName');
    const directBtn = getElement('proxyDirectBtn');
    const loading = getElement('proxyLoading');
    const frameContent = getElement('proxyFrameContent');

    if (!modal || !modalTitle || !modalUrl || !proxyPlatformName || !directBtn || !loading || !frameContent) return;

    modal.classList.remove('hidden');
    modalTitle.innerText = `${name} - VORTEX Proxy Relay`;
    modalUrl.innerText = url;
    proxyPlatformName.innerText = `${name} Stream Tunnel`;
    directBtn.href = url;

    loading.classList.remove('hidden');
    frameContent.classList.add('hidden');

    setTimeout(() => {
        loading.classList.add('hidden');
        frameContent.classList.remove('hidden');
    }, 1200);
}

function closeProxyViewer() {
    const modal = getElement('proxyModal');
    if (modal) modal.classList.add('hidden');
}

function reloadProxyFrame() {
    const loading = getElement('proxyLoading');
    const frameContent = getElement('proxyFrameContent');
    if (!loading || !frameContent) return;

    loading.classList.remove('hidden');
    frameContent.classList.add('hidden');
    setTimeout(() => {
        loading.classList.add('hidden');
        frameContent.classList.remove('hidden');
    }, 1000);
}

document.addEventListener('DOMContentLoaded', () => {
    renderSiteMenu();
    renderPlatforms(platforms);

    const addSiteForm = getElement('addSiteForm');
    if (addSiteForm) {
        addSiteForm.addEventListener('submit', addSite);
        addSiteForm.elements.namedItem('url').addEventListener('input', event => event.target.setCustomValidity(''));
    }

    const resultsGrid = getElement('resultsGrid');
    if (resultsGrid) {
        resultsGrid.addEventListener('click', event => {
            const proxyButton = event.target.closest('[data-proxy-url]');
            if (proxyButton) openProxyViewer(proxyButton.dataset.proxyUrl, proxyButton.dataset.proxyName);
        });
    }

    document.addEventListener('keydown', event => {
        if (event.key === 'Escape') closeAddSiteModal();
    });

});
