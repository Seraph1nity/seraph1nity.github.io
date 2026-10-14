import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.9.0";

// data

const playlist = [
    { name: "moron", file: "assets/audio/moron.opus", icon: "assets/img/music/moron.jpg", author: "m1v & luvwillow" },
    { name: "antichrist", file: "assets/audio/antichrist.opus", icon: "assets/img/music/m1v.jpg", author: "m1v & vanity" },
    { name: "a hardstyle christmas", file: "assets/audio/hardstyle.opus", icon: "assets/img/music/hardstyle.jpg", author: "vanity, d3r & m1v" },
    { name: "m0nster high", file: "assets/audio/monster.opus", icon: "assets/img/music/monster.jpg", author: "hubithekid, kets4eki,\nwujek, fendisuicide" },
    { name: "posted up", file: "assets/audio/postedup.opus", icon: "assets/img/music/postedup.jpg", author: "yati & lchigo, d3r" },
    { name: "she's like a superstar", file: "assets/audio/superstar.opus", icon: "assets/img/music/superstar.jpg", author: "d3r & wasty" },
    { name: "fed", file: "assets/audio/fed.opus", icon: "assets/img/music/m1v.jpg", author: "m1v" },
    { name: "keep yourself safe", file: "assets/audio/kys.opus", icon: "assets/img/music/kys.jpg", author: "cy4ne & \niwannabemissed" },
    { name: "hello kitty camo", file: "assets/audio/hkc.opus", icon: "assets/img/music/hkc.jpg", author: "disoc8" },
    { name: "would u notice", file: "assets/audio/notice.opus", icon: "assets/img/music/notice.jpg", author: "overtonight" },
    { name: "edgy", file: "assets/audio/edgy.opus", icon: "assets/img/music/edgy.jpg", author: "luvwillow" },
    { name: "kylie", file: "assets/audio/kylie.opus", icon: "assets/img/music/kylie.jpg", author: "kets4eki, KidSnorlax,\nPröz, lunarr" },
    { name: "turn it up", file: "assets/audio/tiu.opus", icon: "assets/img/music/tiu.jpg", author: "skypebf & 6arelyhuman" },
    { name: "stay_w_me original", file: "assets/audio/swmo.opus", icon: "assets/img/music/m1v.jpg", author: "m1v" },
    { name: "love bomb", file: "assets/audio/love.opus", icon: "assets/img/music/love.jpg", author: "d3r" },
    { name: "seksualna niebezpieczna", file: "assets/audio/seksualna.opus", icon: "assets/img/music/seksualna.jpg", author: "hubithekid, kets4eki,\nlunarr" },
    { name: "TeAsE", file: "assets/audio/tease.opus", icon: "assets/img/music/m1v.jpg", author: "m1v" },
    { name: "scars 4 u", file: "assets/audio/scars.opus", icon: "assets/img/music/scars.jpg", author: "luvwillow" },
    { name: "thief (wasty) 1/27/2023", file: "assets/audio/thief.opus", icon: "assets/img/music/thief.jpg", author: "d3r archive (wasty)" },
    { name: "4u", file: "assets/audio/4u.opus", icon: "assets/img/music/4u.jpg", author: "lunarr" },
    { name: "molly in my backpack", file: "assets/audio/molly.opus", icon: "assets/img/music/molly.jpg", author: "kets4eki, Crescent,\nwujek" },
    { name: "old memories!", file: "assets/audio/oldmemories.opus", icon: "assets/img/music/m1v2.jpg", author: "m0v / m1v" }
];

const socials = [
    { name: "twitter (nophono calls ts X)", url: "https://x.com/SeraphTheSpawn", handle: "@SeraphTheSpawn" },
    { name: "github", url: "https://github.com/seraph1nity", handle: "@seraph1nity" },
    { name: "namemc", url: "https://namemc.com/profile/TheCatOfTheDark", handle: "TheCatOfTheDark" }
];

const wallets = [
    { name: "monero", address: "47B8w6uBZec2XxrUpkAuWo1EDHoKX3tLdMvLN9XpESfgL3RivKTwE66L6Uk59xkC5qSyDvmTX1f1HCMffdQgZnxU1AEp8ZP" },
    { name: "bitcoin", address: "bc1qhs2pnzz05ueml8tk73228prkfaazr6w64p0euq" },
];

const quotes = [
    `"give me 6 hours to chop down a tree and i will spend the first four gooning" - Abraham lincoln`
];

const weatherDescriptions = {
    0: "clear", 1: "mostly clear", 2: "partly cloudy", 3: "overcast",
    45: "foggy", 48: "foggy",
    51: "light drizzle", 53: "drizzle", 55: "heavy drizzle", 56: "freezing drizzle", 57: "freezing drizzle",
    61: "light rain", 63: "rain", 65: "heavy rain", 66: "freezing rain", 67: "freezing rain",
    71: "light snow", 73: "snow", 75: "heavy snow", 77: "snow grains",
    80: "rain showers", 81: "rain showers", 82: "heavy showers", 85: "snow showers", 86: "snow showers",
    95: "thunderstorm", 96: "thunderstorm with hail", 99: "thunderstorm with hail"
};

// music

class MusicPlayer {
    constructor(tracks) {
        this.tracks = tracks;
        this.index = 0;
        this.loading = false;
        this.audio = new Audio();
        this.audio.volume = 0.3;
        this.audio.addEventListener("loadstart", () => { this.loading = true; });
        this.audio.addEventListener("loadedmetadata", () => { this.loading = false; });
        this.audio.addEventListener("error", () => { this.loading = false; });
        this.audio.addEventListener("ended", () => this.next());
        this.select(0, false);
    }

    get track() {
        return this.tracks[this.index];
    }

    get playing() {
        return !this.audio.paused;
    }

    get currentTime() {
        return this.audio.currentTime || 0;
    }

    get duration() {
        return Number.isFinite(this.audio.duration) ? this.audio.duration : 0;
    }

    play() {
        this.audio.play().catch(() => {});
    }

    pause() {
        this.audio.pause();
    }

    toggle() {
        if (this.playing) this.pause();
        else this.play();
    }

    select(index, autoplay = this.playing) {
        this.index = (index + this.tracks.length) % this.tracks.length;
        this.audio.src = this.track.file;
        if (autoplay) this.play();
    }

    next() {
        this.select(this.index + 1, true);
    }

    previous() {
        this.select(this.index - 1);
    }
}

function formatTime(seconds) {
    const minutes = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(Math.floor(seconds % 60)).padStart(2, "0");
    return `${minutes}:${secs}`;
}

const player = new MusicPlayer(playlist);

// time & weather
const fattytime = new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false
});

let weather = "loading...";

async function fetchWeather() {
    try {
        const response = await fetch("https://api.open-meteo.com/v1/forecast?latitude=-15.7939&longitude=-47.8828&current_weather=true&timezone=America%2FSao_Paulo");
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const { temperature, weathercode } = (await response.json()).current_weather ?? {};
        weather = typeof temperature === "number"
            ? `${Math.round(temperature)}°C, ${weatherDescriptions[weathercode] ?? "unknown"}`
            : "weather unavailable";
    } catch {
        weather = "weather unavailable";
    }
}

// textures

await ImGuiImplWeb.Init({ canvas: document.querySelector("#imgui-canvas"), enableDemos: false });

const textureCache = new Map();

function loadTexture(src) {
    if (!textureCache.has(src)) {
        const texture = { id: ImGuiImplWeb.LoadTexture(), img: new Image(), loaded: false };
        texture.img.onload = () => {
            ImGuiImplWeb.LoadTexture(texture.img, { id: texture.id });
            texture.loaded = true;
        };
        texture.img.src = src;
        textureCache.set(src, texture);
    }
    return textureCache.get(src);
}

const textures = {
    pfp: loadTexture("assets/img/pfp.gif"),
};

const trackIcons = playlist.map(track => loadTexture(track.icon));

// widgets

function link(label, url = label) {
    if (ImGui.TextLink(label)) window.open(url, "_blank", "noopener");
}

function copyLink(label, text = label) {
    if (ImGui.TextLink(label)) navigator.clipboard.writeText(text).catch(() => {});
}

function inline(...parts) {
    parts.forEach((part, i) => {
        if (i > 0) ImGui.SameLine();
        if (typeof part === "string") ImGui.Text(part);
        else link(...part);
    });
}

function answer(question, reply) {
    ImGui.Text(question);
    ImGui.SameLine();
    ImGui.TextDisabled(reply);
}

function image(texture, scale) {
    ImGui.Image(
        new ImTextureRef(texture.id),
        new ImVec2(texture.img.width * scale, texture.img.height * scale)
    );
}

// windows

const windowMargin = 10;
const windowGap = 3;
let nextWindowY = windowMargin;

function drawWindow(title, drawContents) {
    ImGui.SetNextWindowPos(new ImVec2(windowMargin, nextWindowY), ImGui.Cond.FirstUseEver);
    ImGui.SetNextWindowCollapsed(true, ImGui.Cond.FirstUseEver);
    if (ImGui.Begin(title, null, ImGui.WindowFlags.AlwaysAutoResize)) drawContents();
    nextWindowY += ImGui.GetWindowHeight() + windowGap;
    ImGui.End();
}

function drawAbout() {
    ImGui.BeginGroup();
    image(textures.pfp, 1 / 3);
    ImGui.EndGroup();
    ImGui.SameLine(0, 8);
    ImGui.BeginGroup();
    ImGui.Text("hi, i'm Sera.\ni like eating hydrogen (irony)\ni like programming in Rust,Python,Javascript,Lua and CSharp (Rust and Lua being my fav langs)\nwawaborea");
    ImGui.Spacing();
    ImGui.Text(`my time: ${fattytime.format()}\nmy lovely weather: ${weather}`);
    ImGui.EndGroup();
}

function drawProjects() {
    ImGui.Text("heres some pretty cool stuff ive made;");
    ImGui.Spacing();

    if (ImGui.TreeNode("protonservices")) {
        inline("a little project for roblox i made with multiple cool services to add up with roblox's ones");
        inline("repository link:", ["https://github.com/The-Bunker-Organization/"]);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("devtools neo")) {
        ImGui.Text("very dead project, a security fowarded clientside hub with the idea of anti logging and decoding");
        ImGui.Text("was mostly just a bunch of functions fused in a hub but with a custom ui lol and very pro custom api");
        ImGui.Text("devtools isnt coming back any time soon (whole server dead and source deleted)");
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("spawn.bunker")) {
        ImGui.Text("le evil server known as spammy burken,made for archiving scripts and RBXMs,plus deobfuscating code and ragebaiting");
        ImGui.Text("while it only becomes active once every year, it has a LOT of scripts and a bunch of sources");
        ImGui.Text("Osage approved");
        inline("join le bunker:", ["https://discord.gg/MvVBbftUYm"]);
    ImGui.TreePop();
    }

    ImGui.Spacing();
    ImGui.Text("check back later for more thx");
}

function drawLinks() {
    for (const { name, url, handle } of socials) {
        inline([name, url], `: ${handle}`);
    }
}

function drawContact() {
    inline("email:", ["seraphinity@national.shitposting.agency", "mailto:seraphinity@national.shitposting.agency"]);
    inline("discord:", ["@seraphinity_.", "https://discord.com/users/1457638696173178882"]);
}


function drawExtras() {
    if (ImGui.TreeNode("questions")) {
        answer("can i steal this?", "nuh uh");
        answer("are you a female", "maybe");
        answer("ur music sucks i wanna submit soem!!", "no my music doesnt suck grrr but if you wanna submit contact me lol");
        inline("sera pls feet pics", ["here", "assets/img/feetpics.gif"]);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("quotes")) {
        ImGui.Text("dm me on discord to add a quote");
        ImGui.Spacing();
        for (const quote of quotes) ImGui.Text(quote);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("info")) {
        answer("imgui version:", ImGui.GetVersion());
        inline("this site is made using", ["jsimgui", "https://github.com/mori2003/jsimgui"]);
        inline("the website's source is on", ["github", "https://github.com/Seraph1nity/seraph1nity.github.io"]);
        ImGui.TreePop();
    }
}

function drawMusicPlayer() {
    const icon = trackIcons[player.index];
    if (icon.loaded) {
        ImGui.Image(new ImTextureRef(icon.id), new ImVec2(80, 80));
        ImGui.SameLine();
    }
    ImGui.BeginGroup();
    ImGui.Text("now playing:");
    ImGui.Text(player.track.name);
    if (player.loading) ImGui.Text("loading...");
    ImGui.TextDisabled(`by ${player.track.author}`);
    ImGui.EndGroup();
    ImGui.Spacing();

    const buttonSize = new ImVec2(25, 0);
    if (ImGui.Button("<<", buttonSize)) player.previous();
    ImGui.SameLine();
    if (ImGui.Button(player.playing ? "||" : ">", buttonSize)) player.toggle();
    ImGui.SameLine();
    if (ImGui.Button(">>", buttonSize)) player.next();
    ImGui.SameLine(0, 75);
    ImGui.Text(`${formatTime(player.currentTime)} / ${formatTime(player.duration)}`);
    ImGui.Spacing();

    if (ImGui.TreeNode("playlist")) {
        playlist.forEach((track, index) => {
            const isCurrent = index === player.index;
            if (isCurrent) ImGui.PushStyleColor(ImGui.Col.Text, 0xFF66FF66);
            if (ImGui.Selectable(isCurrent ? `> ${track.name}` : track.name, isCurrent) && !isCurrent) {
                player.select(index);
            }
            if (isCurrent) ImGui.PopStyleColor();
        });
        ImGui.TreePop();
    }
}

// render

function render() {
    ImGuiImplWeb.BeginRender();
    nextWindowY = windowMargin;
    drawWindow("about", drawAbout);
    drawWindow("projects", drawProjects);
    drawWindow("links", drawLinks);
    drawWindow("contact", drawContact);
    drawWindow("extras", drawExtras);
    drawWindow("music player", drawMusicPlayer);
    ImGuiImplWeb.EndRender();
    requestAnimationFrame(render);
}

fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);
requestAnimationFrame(render);
