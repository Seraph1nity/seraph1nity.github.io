/*
 * Hallo skidder
 * im here just to give a shoutout to lithium_1on,for the original website source and the functions
 * please check the original one and star his repo
 * > https://lithium.wtf/
 * > https://github.com/lithium1on/lithium
 *
 * - Seraph1nity
*/
import { ImGui, ImVec2, ImTextureRef, ImGuiImplWeb } from "https://esm.sh/@mori2003/jsimgui@0.9.0";

// data

const playlist = [
    { name: ":3", file: "assets/audio/:3.wav", icon: "assets/img/music/:3.jpg", author: "tangermusic" },
    { name: "desu-yo?", file: "assets/audio/desuyo.opus", icon: "assets/img/music/desuyo.jpg", author: "sheqate" },
    { name: "anyone can find love (except you)", file: "assets/audio/love.opus", icon: "assets/img/music/love.jpg", author: "hkmori & glitch cat" },
    { name: "running on a rope", file: "assets/audio/running.opus", icon: "assets/img/music/running.jpg", author: "tangermusic & Treb" },
    { name: "somewhere, someday", file: "assets/audio/somewhere.opus", icon: "assets/img/music/somewhere.jpg", author: "tangermusic" },
    { name: "virtual insanity", file: "assets/audio/vinsanity.opus", icon: "assets/img/music/vinsanity.jpg", author: "hkmori & glitch cat" },
    { name: "moron", file: "assets/audio/moron.opus", icon: "assets/img/music/moron.jpg", author: "m1v & luvwillow" },
    { name: "a hardstyle christmas", file: "assets/audio/hardstyle.opus", icon: "assets/img/music/hardstyle.jpg", author: "vanity, d3r & m1v" },
];

const socials = [
    { name: "twitter (nophono calls ts X)", url: "https://x.com/seraph1nity", handle: "@seraph1nity" },
    { name: "github", url: "https://github.com/seraph1nity", handle: "@seraph1nity" },
    { name: "namemc", url: "https://namemc.com/profile/TheCatOfTheDark", handle: "TheCatOfTheDark" }
];

const quotes = [
  `"give me 6 hours to chop down a tree and i will spend the first four gooning" - Abraham lincoln`,
  `"sephy nyan has femboy potential" - kaikai`,
  `"I built these walls high, now I'm safe from the storm at the cost of the sun" - ryu`,
  `"Shoot for the moon, even if you miss you'll land among the stars" - meimei`,
  `"Sometimes to really love is to let go and never look back" - vlad`,
  `"i sit here broken hearted came to shit but only farted" - moldy`
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
      let musicplayed = false;

      const playgoesvrr = () => {
          if (musicplayed) return;
          musicplayed = true;

          this.play();

          document.removeEventListener("click", playgoesvrr);
          document.removeEventListener("keydown", playgoesvrr);
          document.removeEventListener("touchstart", playgoesvrr);
      };

      document.addEventListener("click", playgoesvrr);
      document.addEventListener("keydown", playgoesvrr);
      document.addEventListener("touchstart", playgoesvrr);
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
        if (typeof part === "string") ImGui.TextWrapped(part);
        else link(...part);
    });
}

function answer(question, reply) {
    ImGui.TextWrapped(question);
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

const windowMargin = 8;
const windowGap = 5;

let nextLeftY = windowMargin;
let nextRightY = windowMargin;

function drawWindow(title, drawContents, side = "left", desktopWidth = 0) {
    const canvas = document.querySelector("#imgui-canvas");

    const mobile = canvas.clientWidth < 700;
    const width = canvas.clientWidth;

    const isRight = !mobile && side === "right";

    const windowWidth = mobile
        ? width - windowMargin * 2
        : desktopWidth;

    const x = mobile
        ? windowMargin
        : isRight ? width - windowMargin : windowMargin;

    const y = mobile
        ? nextLeftY
        : isRight ? nextRightY : nextLeftY;

    ImGui.SetNextWindowPos(
        new ImVec2(x, y),
        ImGui.Cond.Always,
        new ImVec2(isRight ? 1 : 0, 0)
    );

    ImGui.SetNextWindowSize(
        new ImVec2(windowWidth > 0 ? windowWidth : 0, 0),
        ImGui.Cond.Always
    );

    ImGui.SetNextWindowCollapsed(
        title !== "music player",
        ImGui.Cond.FirstUseEver
    );

    if (ImGui.Begin(
        title,
        null,
        ImGui.WindowFlags.NoMove |
        ImGui.WindowFlags.NoResize |
        ImGui.WindowFlags.NoSavedSettings
    )) {
        drawContents();
    }

    const nextY = y + ImGui.GetWindowHeight() + windowGap;

    if (mobile || !isRight) {nextLeftY = nextY;} else {nextRightY = nextY;}
    ImGui.End();
}





function drawAbout() {
    ImGui.BeginGroup();
    image(textures.pfp, 1 / 3);
    ImGui.EndGroup();
    ImGui.SameLine(0, 8);
    ImGui.BeginGroup();
    ImGui.TextWrapped("hi, i'm Sera.\ni like eating hydrogen (irony)\ni like programming in Rust,Python,Javascript,Lua and CSharp (Rust and Lua being my fav langs)\nwawaborean");
    ImGui.Spacing();
    ImGui.TextWrapped(`my time: ${fattytime.format()}\nmy lovely weather: ${weather}`);
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
        ImGui.TextWrapped("very dead project, a security fowarded clientside hub with the idea of anti logging and decoding");
        ImGui.TextWrapped("was mostly just a bunch of functions fused in a hub but with a custom ui lol and very pro custom api");
        ImGui.TextWrapped("devtools isnt coming back any time soon (whole server dead and source deleted)");
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("ARMer")) {
      inline("VM obfuscation for luaU with macros and a very kewl anti-env (woah)");
      //image()
      inline("while it is in beta with no support for sUnc or chunk loading plus having a lazy bytecode fragmentation,it cant be deobfuscated by ExoEnv!!!!!!! (no AIs skidding my code) ");
      inline("it is currently private and only usable by whitelisted people,so yeah,if you wanna try making it yourself :p")
      ImGui.TreePop()
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
    inline("matrix:", ["seraphinity:matrix.org","https://matrix.to/#/@seraphinity:matrix.org"]);
    inline("PGP key:", ["public key here", "./assets/misc/PGP.asc"])
}


function drawExtras() {
    if (ImGui.TreeNode("questions")) {
        answer("are you a female", "maybe");
        answer("ur music sucks i wanna submit soem!!", "no my music doesnt suck grrr but if you wanna submit contact me lol");
        inline("sera pls feet pics", ["here", "assets/img/feetpics.gif"]);
        ImGui.TreePop();
    }

    if (ImGui.TreeNode("quotes")) {
      ImGui.Text("dm me on discord to add a quote");
      ImGui.Spacing();
      const geen = (120 | (153 << 8) | (34 << 16) | (255 << 24)) >>> 0;
      ImGui.PushStyleColor(ImGui.Col.Text, geen);
      for (const quote of quotes){ ImGui.TextWrapped("> " + quote);};
      ImGui.PopStyleColor();
      ImGui.TreePop();
  }

    if (ImGui.TreeNode("subplaces")) {
        ImGui.Text("here are some subplaces of this website with cool stuff:");
        ImGui.Spacing();
        inline(["> Sera's linux runner", "./linux.html"]);
        inline(["> Conway's game of life", "./life.html"]);
        inline(["> Sera's fumo viewer", "./byte.html"]);

        ImGui.TreePop();
    }

    if (ImGui.TreeNode("info")) {
        answer("imgui version:", ImGui.GetVersion());
        inline("this site is made using", ["jsimgui", "https://github.com/mori2003/jsimgui"]);
        inline("this website was originally forked from", ["@lithium_1on", "https://lithium.wtf/"]);
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
  nextLeftY = windowMargin;
  nextRightY = windowMargin;
  drawWindow("about", drawAbout, "left");
  drawWindow("projects", drawProjects, "left");
  drawWindow("links", drawLinks, "left");
  drawWindow("contact", drawContact, "left");
  drawWindow("extras", drawExtras, "left");
  drawWindow("music player", drawMusicPlayer, "left");


//   drawWindow("newsletters", drawBlog,"right",400)
  ImGuiImplWeb.EndRender();
  requestAnimationFrame(render);
}

fetchWeather();
setInterval(fetchWeather, 10 * 60 * 1000);
requestAnimationFrame(render);
