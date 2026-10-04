const filterButtons = document.querySelectorAll("[data-filter]");
const menuItems = document.querySelectorAll("[data-category]");
const filterStatus = document.querySelector("#filterStatus");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const category = button.dataset.filter;
    let visibleCount = 0;

    menuItems.forEach((item) => {
      item.hidden = category !== "all" && item.dataset.category !== category;
      if (!item.hidden) visibleCount += 1;
    });

    filterButtons.forEach((filter) => {
      const selected = filter === button;
      filter.classList.toggle("active", selected);
      filter.setAttribute("aria-pressed", String(selected));
    });

    const label = category === "all" ? "house" : category;
    filterStatus.textContent = `Showing ${visibleCount} ${label} ${visibleCount === 1 ? "favorite" : "favorites"}.`;
  });
});

document.querySelector("#menuFilters").hidden = false;

const carousel = document.querySelector("#coffeeCarousel");
const indicators = document.querySelectorAll("[data-bs-slide-to]");

carousel.addEventListener("slid.bs.carousel", (event) => {
  document.querySelector("#slideCount > span").textContent = String(
    event.to + 1,
  ).padStart(2, "0");

  indicators.forEach((indicator, index) => {
    const selected = index === event.to;
    indicator.classList.toggle("active", selected);
    if (selected) indicator.setAttribute("aria-current", "true");
    else indicator.removeAttribute("aria-current");
  });
});

const productInfo = {
  espresso: {
    ingredients:
      "Freshly ground coffee and filtered water. Served as a 60 ml double shot.",
    note: "Served hot, without milk. Naturally bold, with notes of cocoa and toasted nuts.",
  },
  latte: {
    ingredients:
      "A double shot of espresso, milk, and ice. Served in a 350 ml glass.",
    note: "Contains milk. Prefer it a little sweeter? Ask the crew about adding vanilla.",
  },
  croissant: {
    ingredients:
      "Wheat flour, butter, milk, yeast, sugar, salt, and an egg glaze.",
    note: "Contains wheat (gluten), milk, and egg. Baked fresh daily and lovely with an espresso.",
  },
};

document
  .querySelector("#productModal")
  .addEventListener("show.bs.modal", (event) => {
    const trigger = event.relatedTarget;
    const product = productInfo[trigger?.dataset.product];
    const card = trigger?.closest(".card");

    if (!product || !card) {
      event.preventDefault();
      return;
    }

    const sourceImage = card.querySelector("img");
    const modalImage = document.querySelector("#productImage");
    modalImage.src = sourceImage.getAttribute("src");
    modalImage.alt = sourceImage.alt;
    document.querySelector("#productTitle").textContent =
      card.querySelector(".card-title").textContent;
    document.querySelector("#productPrice").textContent =
      card.querySelector(".price").textContent;
    document.querySelector("#productDescription").textContent =
      card.querySelector(".card-text").textContent;
    document.querySelector("#productIngredients").textContent =
      product.ingredients;
    document.querySelector("#productNote").textContent = product.note;
  });

document.querySelectorAll("[data-product]").forEach((button) => {
  button.hidden = false;
});

const navbarMenu = document.querySelector("#navbarMenu");
const navigationLinks = navbarMenu.querySelectorAll('a[href^="#"]');

navigationLinks.forEach((link) => {
  link.addEventListener("click", () => {
    if (!navbarMenu.classList.contains("show")) return;

    navbarMenu.addEventListener(
      "hidden.bs.collapse",
      () => {
        const destination = document.querySelector(link.getAttribute("href"));
        destination.setAttribute("tabindex", "-1");
        destination.focus({ preventScroll: true });
      },
      { once: true },
    );

    bootstrap.Collapse.getOrCreateInstance(navbarMenu, {
      toggle: false,
    }).hide();
  });
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;

      navigationLinks.forEach((link) => {
        const selected = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", selected);
        if (selected) link.setAttribute("aria-current", "location");
        else link.removeAttribute("aria-current");
      });
    });
  },
  { rootMargin: "-20% 0px -60% 0px" },
);

document.querySelectorAll("main > section[id]").forEach((section) => {
  sectionObserver.observe(section);
});
