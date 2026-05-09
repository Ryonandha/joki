console.log("Hero JS is running");

// amount button
const amountBtns = document.querySelectorAll(".amount-buttons button");

amountBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    amountBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
  });
});

// payment method
const paymentOptions = document.querySelectorAll(".payment-option");
const detailBox = document.getElementById("payment-detail");

paymentOptions.forEach((option) => {
  option.addEventListener("click", () => {
    paymentOptions.forEach((o) => o.classList.remove("active"));
    option.classList.add("active");

    const method = option.dataset.method;

    if (method === "bank") {
      detailBox.innerHTML = `
        <div class="payment-detail-box">
        <p><strong>Bank BCA</strong><br>No. Rek: 6110596764</p>
        <p><strong>Bank BSI</strong><br>No. Rek: 7081684477</p>
        <p><strong>Atas Nama:</strong> Yayasan Yappa</p>
        </div>
    `;
    }

    if (method === "ewallet") {
      detailBox.innerHTML = `
        <div class="payment-detail-box">
          <p>Scan QRIS below</p>
          <img src="images/qris.png" width="150">
        </div>
      `;
    }
  });
});

document.addEventListener("DOMContentLoaded", function () {
  console.log("JS LOADED");

  const volunteerModal = document.getElementById("volunteerModal");
  const openBtns = document.querySelectorAll(".open-volunteer");
  const closeBtn = document.querySelector(".close-btn");
  const volunteerForm = document.getElementById("volunteerForm");
  const popup = document.getElementById("registrationPopup");

  const volunteerSupabase = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
  );

  // open modal
  openBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      volunteerModal.classList.add("show");
      document.body.classList.add("modal-open");
    });
  });

  // close modal
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      volunteerModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    });
  }

  window.addEventListener("click", (e) => {
    if (e.target === volunteerModal) {
      volunteerModal.classList.remove("show");
      document.body.classList.remove("modal-open");
    }
  });

  // form submit volunteer
  if (volunteerForm) {
    volunteerForm.addEventListener("submit", async function (e) {
      e.preventDefault();

      const firstName = document.getElementById("firstName").value.trim();
      const lastName = document.getElementById("lastName").value.trim();
      const phone = document.getElementById("phone").value.trim();
      const email = document.getElementById("email").value.trim();
      const address = document.getElementById("address").value.trim();
      const age = document.getElementById("age").value.trim();
      const motivation = document.getElementById("motivation").value.trim();

      const submitBtn = volunteerForm.querySelector(".btn-submit");

      if (
        !firstName ||
        !lastName ||
        !phone ||
        !email ||
        !address ||
        !age ||
        !motivation
      ) {
        alert("Please fill all fields!");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Submitting...";

      const { error } = await volunteerSupabase.from("volunteer").insert([
        {
          first_name: firstName,
          last_name: lastName,
          phone_number: phone,
          email: email,
          address: address,
          age: Number(age),
          motivation: motivation,
        },
      ]);

      if (error) {
        console.error("Supabase volunteer error:", error);
        alert("Volunteer registration failed. Please try again.");

        submitBtn.disabled = false;
        submitBtn.textContent = "Submit";
        return;
      }

      volunteerModal.classList.remove("show");
      document.body.classList.remove("modal-open");

      if (popup) {
        popup.style.display = "flex";
      }

      volunteerForm.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit";
    });
  }
});

// close pop up
function closePopup() {
  const popup = document.getElementById("registrationPopup");
  if (popup) {
    popup.style.display = "none";
  }
}

// news search & filter
(function () {
  const input = document.getElementById("searchInput");
  const categoryFilter = document.getElementById("categoryFilter");
  const searchBtn = document.getElementById("searchBtn");
  const cards = document.querySelectorAll(".news-card");
  const noResult = document.getElementById("noResult");

  if (cards.length === 0) return;

  function getCategoryByTitle(title) {
    const text = title.toLowerCase();

    // Events & Activity
    if (
      text.includes("41st anniversary") ||
      text.includes("iftar invitation") ||
      text.includes("westin") ||
      text.includes("50th anniversary") ||
      text.includes("independence day") ||
      text.includes("graduation") ||
      text.includes("qurban") ||
      text.includes("49th anniversary") ||
      text.includes("eid al-adha") ||
      text.includes("islamic new year") ||
      text.includes("maulid")
    ) {
      return "events";
    }

    // Partnership & Outreach
    if (
      text.includes("bni") ||
      text.includes("pelindo") ||
      text.includes("elnusa")
    ) {
      return "partnership";
    }

    // Programs Updates
    if (
      text.includes("pesantren") ||
      text.includes("islamic boarding") ||
      text.includes("competitions") ||
      text.includes("cooperative") ||
      text.includes("rat") ||
      text.includes("humanitarian") ||
      text.includes("admission")
    ) {
      return "programs";
    }

    return "events";
  }

  function filterNews() {
    const keyword = input ? input.value.toLowerCase().trim() : "";
    const selectedCategory = categoryFilter ? categoryFilter.value : "all";
    let found = false;

    cards.forEach((card) => {
      const titleElement = card.querySelector("h3");
      const descElement = card.querySelector("p");

      const title = titleElement ? titleElement.textContent : "";
      const desc = descElement ? descElement.textContent : "";

      const titleLower = title.toLowerCase();
      const descLower = desc.toLowerCase();

      const cardCategory = card.dataset.category || getCategoryByTitle(title);

      const matchSearch =
        keyword === "" ||
        titleLower.includes(keyword) ||
        descLower.includes(keyword);

      const matchCategory =
        selectedCategory === "all" || cardCategory === selectedCategory;

      const showCard = matchSearch && matchCategory;

      card.style.display = showCard ? "" : "none";

      if (showCard) {
        found = true;
      }
    });

    if (noResult) {
      noResult.style.display = found ? "none" : "block";
    }
  }

  /* if (input) {
    input.addEventListener("input", filterNews);
  } */

  if (categoryFilter) {
    categoryFilter.addEventListener("change", filterNews);
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      filterNews();
    });
  }

  // auto filter from URL
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFromUrl = urlParams.get("category");

  if (
    categoryFromUrl &&
    categoryFilter &&
    ["events", "programs", "partnership"].includes(categoryFromUrl)
  ) {
    categoryFilter.value = categoryFromUrl;

    // hapus query param setelah dipakai
    window.history.replaceState({}, document.title, "news.html");
  }

  filterNews();
})();

// gallery search & monthly filter
(function () {
  const searchInput = document.getElementById("gallerySearchInput");
  const monthFilter = document.getElementById("galleryMonthFilter");
  const searchBtn = document.getElementById("gallerySearchBtn");
  const galleryItems = document.querySelectorAll(".gallery-item");
  const noResult = document.getElementById("galleryNoResult");

  if (galleryItems.length === 0) return;

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  function getDateText(item) {
    const dateElement = item.querySelector(".overlay p");
    return dateElement
      ? dateElement.textContent.replace("Date:", "").trim()
      : "";
  }

  function parseDate(dateText) {
    const parts = dateText.split("/");

    if (parts.length !== 3) return null;

    const day = parts[0];
    const month = parts[1];
    const year = parts[2];

    return {
      day,
      month,
      year,
      value: `${year}-${month}`,
      label: `${monthNames[Number(month) - 1]} ${year}`,
    };
  }

  function buildMonthFilter() {
    if (!monthFilter) return;

    const months = new Map();

    galleryItems.forEach((item) => {
      const dateText = getDateText(item);
      const parsedDate = parseDate(dateText);

      if (parsedDate) {
        months.set(parsedDate.value, parsedDate.label);
      }
    });

    const sortedMonths = Array.from(months.entries()).sort((a, b) => {
      return b[0].localeCompare(a[0]);
    });

    sortedMonths.forEach(([value, label]) => {
      const option = document.createElement("option");
      option.value = value;
      option.textContent = label;
      monthFilter.appendChild(option);
    });
  }

  function filterGallery() {
    const keyword = searchInput ? searchInput.value.toLowerCase().trim() : "";
    const selectedMonth = monthFilter ? monthFilter.value : "all";
    let found = false;

    galleryItems.forEach((item) => {
      const titleElement = item.querySelector(".overlay h4");
      const dateText = getDateText(item);
      const parsedDate = parseDate(dateText);

      const title = titleElement ? titleElement.textContent.toLowerCase() : "";
      const date = dateText.toLowerCase();
      const monthLabel = parsedDate ? parsedDate.label.toLowerCase() : "";

      const searchableText = `${title} ${date} ${monthLabel}`;

      const matchSearch = keyword === "" || searchableText.includes(keyword);

      const matchMonth =
        selectedMonth === "all" ||
        (parsedDate && parsedDate.value === selectedMonth);

      const showItem = matchSearch && matchMonth;

      item.style.display = showItem ? "" : "none";

      if (showItem) {
        found = true;
      }
    });

    if (noResult) {
      noResult.style.display = found ? "none" : "block";
    }
  }

  buildMonthFilter();

  /* if (searchInput) {
    searchInput.addEventListener("input", filterGallery);
  } */

  if (monthFilter) {
    monthFilter.addEventListener("change", filterGallery);
  }

  if (searchBtn) {
    searchBtn.addEventListener("click", function (e) {
      e.preventDefault();
      filterGallery();
    });
  }

  filterGallery();
})();

// pop up card news
const newsModal = document.getElementById("newsModal");
const newsTitle = document.getElementById("newsTitle");
const newsImage = document.getElementById("newsImage");
const newsDate = document.getElementById("newsDate");
const newsDesc = document.getElementById("newsDesc");

const closeNewsBtn = document.querySelector(".close-news");
const backNewsBtn = document.querySelector(".btn-back");

function closeNewsModal() {
  if (!newsModal) return;

  newsModal.style.display = "none";
  document.body.classList.remove("modal-open");
}

document.querySelectorAll(".read-more").forEach((btn) => {
  btn.addEventListener("click", function (e) {
    e.preventDefault();

    if (!newsModal || !newsTitle || !newsImage || !newsDate || !newsDesc)
      return;

    newsTitle.textContent = this.dataset.title;
    newsImage.src = this.dataset.image;
    newsDate.innerHTML = "📅 <span>" + this.dataset.date + "</span>";
    newsDesc.innerHTML = this.dataset.desc.replace(/\n/g, "<br><br>");

    newsModal.style.display = "flex";
    document.body.classList.add("modal-open");
  });
});

if (closeNewsBtn) {
  closeNewsBtn.addEventListener("click", closeNewsModal);
}

if (backNewsBtn) {
  backNewsBtn.addEventListener("click", closeNewsModal);
}

if (newsModal) {
  newsModal.addEventListener("click", function (e) {
    if (e.target === newsModal) {
      closeNewsModal();
    }
  });
}

document.addEventListener("keydown", function (e) {
  if (e.key === "Escape") {
    closeNewsModal();
  }
});

// donation handler

document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".impact-card");
  const formSection = document.querySelector(".donation-form-section");
  const selectedText = document.getElementById("selectedImpact");
  const impactFields = document.getElementById("impactFields");
  const donationBox = document.querySelector(".donation-box");
  const donationBtn = document.getElementById("donationSubmit");
  const registrationBtn = document.getElementById("registrationSubmit");

  const amountSection =
    document.querySelector(".amount-buttons")?.parentElement;
  const paymentOptions = document.querySelectorAll(".payment-option");

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
  );

  let currentCategory = "";

  // click card

  cards.forEach((card) => {
    card.addEventListener("click", () => {
      cards.forEach((c) => c.classList.remove("active"));
      card.classList.add("active");

      const type = card.dataset.impact;
      currentCategory = type;

      formSection.scrollIntoView({ behavior: "smooth" });

      donationBox.classList.remove("blue", "purple", "green");

      // reset active payment dan amount
      document
        .querySelectorAll(".payment-option")
        .forEach((p) => p.classList.remove("active"));

      document
        .querySelectorAll(".amount-buttons button")
        .forEach((b) => b.classList.remove("active"));

      detailBox.innerHTML = "";

      if (type === "education") {
        donationBox.classList.add("blue");
        renderEducation();
        togglePayment(true);
      }

      if (type === "daily") {
        donationBox.classList.add("purple");
        renderDaily();
      }

      if (type === "health") {
        donationBox.classList.add("green");
        renderHealth();
        togglePayment(true);
      }
    });
  });

  // render education

  function renderEducation() {
    selectedText.textContent = "Selected Impact: Education Support";

    impactFields.innerHTML = `
      <h4>Education Support</h4>

      <label>Type of Support</label>
      <select>
        <option>School Supplies</option>
        <option>Tuition Fee</option>
        <option>Books & Learning Materials</option>
        <option>Scholarship</option>
      </select>

      <label>Purpose (Optional)</label>
      <input type="text" placeholder="School uniform / Monthly tuition">
    `;
  }

  // render health

  function renderHealth() {
    selectedText.textContent = "Selected Impact: Healthcare";

    impactFields.innerHTML = `
      <h4>Healthcare Support</h4>

      <label>Type of Support</label>
      <select>
        <option>Medical Checkup</option>
        <option>Treatment Support</option>
        <option>Nutrition Support</option>
        <option>Emergency Aid</option>
      </select>

      <label>Notes (Optional)</label>
      <input type="text" placeholder="Medical assistance / Nutrition support">
    `;
  }

  // render daily

  function renderDaily() {
    selectedText.textContent = "Selected Impact: Daily Needs";

    impactFields.innerHTML = `
      <h4>Daily Needs</h4>

      <label>Donation Type</label>
      <select id="donationType">
        <option value="money">Monetary Donation</option>
        <option value="item">Direct Item Donation</option>
      </select>

      <div id="dailyDynamic"></div>
    `;

    document
      .getElementById("donationType")
      .addEventListener("change", handleDailyType);

    handleDailyType();
  }

  function handleDailyType() {
    const type = document.getElementById("donationType").value;
    const container = document.getElementById("dailyDynamic");

    if (type === "money") {
      container.innerHTML = `
        <label>Type of Support</label>
        <select>
          <option>Food Package (Sembako)</option>
          <option>Clothing Support</option>
          <option>Hygiene Kit</option>
          <option>General Needs</option>
        </select>

        <label>Details (Optional)</label>
        <input type="text" placeholder="Food for 1 month">
      `;

      togglePayment(true);
    } else {
      container.innerHTML = `
        <label>Type of Donation</label>
        <select>
          <option>Clothes</option>
          <option>Food (Sembako)</option>
          <option>Hygiene Items</option>
          <option>General Needs</option>
        </select>

        <label>Details (Optional)</label>
        <input type="text" placeholder="Kids clothes">

        <p class="note">
          You may bring your donation items directly to YAPPA Foundation.
        </p>
      `;

      togglePayment(false);
    }
  }

  // show / hide payment

  function togglePayment(show) {
    if (!amountSection) return;

    amountSection.style.display = show ? "block" : "none";

    paymentOptions.forEach((el) => {
      el.style.display = show ? "block" : "none";
    });
  }

  // submit donation
  if (donationBtn) {
    donationBtn.addEventListener("click", async () => {
      if (!currentCategory) {
        alert("Pilih kategori donasi dulu!");
        return;
      }

      const firstName = document.getElementById("donFirstName").value.trim();
      const lastName = document.getElementById("donLastName").value.trim();
      const email = document.getElementById("donEmail").value.trim();
      const phone = document.getElementById("donPhone").value.trim();
      const message = document.getElementById("donMessage").value.trim();

      if (!firstName || !email || !phone) {
        alert("First Name, Email, and Phone are required fields!");
        return;
      }

      // amount
      const activeBtn = document.querySelector(".amount-buttons button.active");
      const customAmount = document.getElementById("customAmount").value;

      let amount = null;

      if (activeBtn) {
        amount = activeBtn.textContent.replace(/[^\d]/g, "");
      } else if (customAmount) {
        amount = customAmount.replace(/[^\d]/g, "");
      }

      // payment
      const activePayment = document.querySelector(".payment-option.active");
      const paymentMethod = activePayment ? activePayment.dataset.method : null;

      // dynamic field
      const select = document.querySelector("#impactFields select");
      const supportType = select ? select.value : null;

      const detailInput = document.querySelector(
        "#impactFields input[type='text']",
      );
      const details = detailInput ? detailInput.value : null;

      const donationTypeSelect = document.getElementById("donationType");
      const donationType = donationTypeSelect
        ? donationTypeSelect.value
        : "money";

      // validasi
      if (currentCategory !== "daily" || donationType === "money") {
        if (!amount) {
          alert("Masukkan nominal donasi!");
          return;
        }

        if (!paymentMethod) {
          alert("Pilih metode pembayaran!");
          return;
        }
      }

      // loading
      donationBtn.disabled = true;
      donationBtn.textContent = "Processing...";

      const { error } = await supabaseClient.from("donations").insert([
        {
          category: currentCategory,
          donation_type: donationType,
          support_type: supportType,
          details,
          first_name: firstName,
          last_name: lastName,
          email,
          phone_number: phone,
          amount: amount ? Number(amount) : null,
          payment_method: paymentMethod,
          message,
        },
      ]);

      if (error) {
        console.error(error);
        alert("Donasi gagal!");
        donationBtn.disabled = false;
        donationBtn.textContent = "Complete Donation";
        return;
      }

      // alert("Donasi berhasil dikirim!");

      // reset form
      const donationSection = document.querySelector(".donation-form-section");

      donationSection
        .querySelectorAll("input, textarea")
        .forEach((el) => (el.value = ""));

      document
        .querySelectorAll(".amount-buttons button")
        .forEach((b) => b.classList.remove("active"));

      document
        .querySelectorAll(".payment-option")
        .forEach((p) => p.classList.remove("active"));

      donationBtn.disabled = false;
      donationBtn.textContent = "Complete Donation";
    });
  }
});

// hero slideshow
document.addEventListener("DOMContentLoaded", function () {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots .dot");

  if (slides.length === 0) return;

  let slideIndex = 0;
  let slideTimer;

  function showSlide(index) {
    if (index >= slides.length) {
      index = 0;
    }

    if (index < 0) {
      index = slides.length - 1;
    }

    slideIndex = index;

    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === slideIndex);
    });

    dots.forEach((dot, i) => {
      dot.classList.toggle("active", i === slideIndex);
    });
  }

  function nextSlide() {
    showSlide(slideIndex + 1);
  }

  function startAutoSlide() {
    clearInterval(slideTimer);
    slideTimer = setInterval(nextSlide, 15000);
  }

  // klik dots
  dots.forEach((dot, index) => {
    dot.addEventListener("click", function () {
      showSlide(index);
      startAutoSlide();
    });
  });

  // INI YANG PENTING: langsung tampilkan slide pertama
  showSlide(0);

  // baru mulai auto slide
  startAutoSlide();
});

document.addEventListener("DOMContentLoaded", function () {
  AOS.init({
    duration: 600,
    once: true,
    offset: 0,
  });
});

// SUPABASE
// ===============================
const SUPABASE_URL = "https://jdzwkhmgfenmxpkkjikk.supabase.co";
const SUPABASE_PUBLIC_KEY = "sb_publishable_nmu6tsYcqZxpAJ1M9unE9A_SDtlYYNE";

// CONTACT MESSAGE FORM

const messageForm = document.getElementById("messageForm");

if (messageForm) {
  const messageSubmitBtn = document.getElementById("messageSubmitBtn");

  const supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLIC_KEY,
  );

  messageForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const firstName = document.getElementById("contactFirstName").value.trim();
    const lastName = document.getElementById("contactLastName").value.trim();
    const email = document.getElementById("contactEmail").value.trim();
    const phoneNumber = document
      .getElementById("contactPhoneNumber")
      .value.trim();
    const message = document.getElementById("contactMessage").value.trim();

    if (!firstName || !email || !message) {
      alert("Please fill in First Name, Email, and Message.");
      return;
    }

    messageSubmitBtn.disabled = true;
    messageSubmitBtn.textContent = "Sending...";

    const { error } = await supabaseClient.from("message").insert([
      {
        first_name: firstName,
        last_name: lastName,
        email: email,
        phone_number: phoneNumber,
        message: message,
      },
    ]);

    if (error) {
      console.error("Supabase error:", error);
      alert("Message failed to send. Please try again.");

      messageSubmitBtn.disabled = false;
      messageSubmitBtn.textContent = "Send Message";
      return;
    }

    alert("Message sent successfully!");

    messageForm.reset();
    messageSubmitBtn.disabled = false;
    messageSubmitBtn.textContent = "Send Message";
  });
}

const donationBtn = document.getElementById("donationSubmit");
const donationPopup = document.getElementById("donationPopup");
const registrationPopup = document.getElementById("registrationPopup");

donationBtn.addEventListener("click", () => {
  // validasi sederhana
  const firstName = document.getElementById("donFirstName").value;
  const email = document.getElementById("donEmail").value;

  if (firstName === "" || email === "") {
    alert("Please fill in required fields.");
    return;
  }

  // tampilkan popup sukses
  donationPopup.style.display = "flex";
});

function closeDonationPopup() {
  donationPopup.style.display = "none";
}

function closeRegistrationPopup() {
  registrationPopup.style.display = "none";
}
