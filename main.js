// pull sections into focus as they scroll into view
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

// local time in Prague, swiss-timetable style
const clock = document.getElementById("clock");
const tick = () => {
  clock.textContent = new Date().toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Prague",
  });
};
tick();
setInterval(tick, 10000);

document.getElementById("year").textContent = new Date().getFullYear();

// the haze leans gently toward the cursor
const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const haze = document.querySelector(".haze");
if (!reduce && haze) {
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener("pointermove", (e) => {
    tx = (e.clientX / window.innerWidth - 0.5) * 60;
    ty = (e.clientY / window.innerHeight - 0.5) * 60;
  });
  const loop = () => {
    x += (tx - x) * 0.03;
    y += (ty - y) * 0.03;
    haze.style.transform = `translate3d(${x}px, ${y}px, 0)`;
    requestAnimationFrame(loop);
  };
  loop();
}

// watch: each still sits behind frosted glass; play swaps in the youtube player.
// youtube refuses to embed without a referring origin (error 153), so a page
// opened straight from disk sends people to youtube instead.
document.querySelectorAll(".film").forEach((film) => {
  const id = film.dataset.youtube;
  const title = film.querySelector(".film__title").textContent;
  film.querySelector(".film__play").addEventListener("click", () => {
    if (location.protocol === "file:") {
      window.open(`https://www.youtube.com/watch?v=${id}`, "_blank", "noopener");
      return;
    }
    film.querySelector(".film__frame").innerHTML = `<iframe src="https://www.youtube.com/embed/${id}?autoplay=1&rel=0&playsinline=1"
      title="${title} — odd little thrills" referrerpolicy="strict-origin-when-cross-origin"
      allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen></iframe>`;
  });
});
