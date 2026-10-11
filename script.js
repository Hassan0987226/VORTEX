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

let activeCategory = 'All';

const getElement = (id) => document.getElementById(id);

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
        return;
    }

    list.forEach(site => {
        const tagHTML = site.tags.map(t =>
            `<span class="text-[10px] bg-slate-900 text-vortex-cyan border border-vortex-cyan/20 px-2 py-0.5 rounded-full font-mono">${t}</span>`
        ).join(' ');

        grid.innerHTML += `
            <div class="glass-card p-6 rounded-2xl flex flex-col justify-between space-y-4 relative group">
                <div class="space-y-3">
                    <div class="flex items-center justify-between">
                        <h3 class="text-xl font-extrabold text-white group-hover:text-vortex-cyan transition">${site.name}</h3>
                        <span class="text-xs bg-vortex-pink/20 text-vortex-pink border border-vortex-pink/30 px-2.5 py-1 rounded-lg font-bold">${site.category}</span>
                    </div>

                    <p class="text-xs text-gray-400 leading-relaxed">${site.desc}</p>

                    <div class="flex flex-wrap gap-1.5 pt-1">
                        ${tagHTML}
                    </div>
                </div>

                <div class="pt-4 border-t border-white/10 flex flex-col gap-2">
                    <button onclick="openProxyViewer('${site.url}', '${site.name}')" class="w-full btn-cyan-gradient text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md">
                        <i class="fa-solid fa-shield-halved"></i> Open via Vortex Proxy
                    </button>

                    <a href="${site.url}" target="_blank" rel="noopener noreferrer" class="w-full bg-slate-800 hover:bg-slate-700 text-gray-300 font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/10 transition">
                        Direct Link <i class="fa-solid fa-arrow-up-right-from-square text-[10px]"></i>
                    </a>
                </div>
            </div>
        `;
    });
}

function filterResults() {
    const searchInput = getElement('searchInput');
    if (!searchInput) return;

    const query = searchInput.value.toLowerCase().trim();
    const filtered = platforms.filter(p => {
        const matchesCategory = (activeCategory === 'All') || (p.category === activeCategory);
        const matchesQuery = p.name.toLowerCase().includes(query) || p.desc.toLowerCase().includes(query) || p.tags.some(t => t.toLowerCase().includes(query));
        return matchesCategory && matchesQuery;
    });
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
    renderPlatforms(platforms);
    const searchInput = getElement('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterResults);
    }
});
