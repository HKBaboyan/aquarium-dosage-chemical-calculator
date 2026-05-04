// --- Helper Function: Get Numeric Value (consistent UX) ---
const getValue = (id) => parseFloat(document.getElementById(id).value) || 0;

// --- Dosing Logic Constant Factors ---
// These factors represent standard hobby guidelines for common products.
// They represent 'X ml of product needed per Y Liters/Gallons'.

const DOSING_FACTORS = {
  // Standard ferts (e.g., Flourish): ~1ml per 10 Gallons (38L) per dose
  fertilizer: {
    mlPerLiter: 0.026, // Derived from (1ml / 37.8L)
    instructions:
      "standard comprehensive plant nutrient dosing (e.g. 1-2 times weekly).",
  },
  // Standard dechlor (e.g., Prime/Safe): Very concentrated, ~1ml per 10 Gallons
  dechlorinator: {
    mlPerLiter: 0.026, // Derived from (1ml / 37.8L)
    instructions:
      "dosage for a standard water change (neutralizing chlorine/chloramine).",
  },
  // Medications vary wildly; this is a generic 'mild' concentration for demonstration.
  medication: {
    mlPerLiter: 0.05, // Generic factor for demonstration (e.g., 1ml per 5 Gal / 20L)
    instructions: "a *generic* baseline concentration for mild medications.",
  },
};

// --- Main Calculation Logic ---
function calculateDosage() {
  const unit = document.getElementById("unit").value;
  const chemical = document.getElementById("chemical-type").value;
  const res = document.getElementById("result");

  // Get Inputs
  const volInput = getValue("tank-vol");

  // Minimal sanity check (theme consistent)
  if (volInput <= 0) {
    res.innerText = "Please enter a valid tank volume.";
    return;
  }

  // --- Step 1: Normalize Volume to Liters (Internal Calculation) ---
  // Math is simpler in ml per Liter.
  let internalVolLiters = volInput; // Defaults to Liters if unit === 'metric'

  if (unit === "us") {
    internalVolLiters = volInput / 0.264172; // Gallons to Liters
  }

  // --- Step 2: Apply the correct Factor ---
  const productData = DOSING_FACTORS[chemical];
  const mlNeeded = internalVolLiters * productData.mlPerLiter;

  // --- Step 3: Handle Small/Large Dosages (Formatting) ---
  // A vital addition: some dosages are too small for ml, we should convert to drops.
  // Standard drop (Hobby): ~0.05 ml

  let dosageOutput = "";
  const drops = Math.round(mlNeeded / 0.05);

  // UX decision: If dosage is very small (<0.25ml), only show drops.
  // If dosage is small (<1.0ml), show ml and drops.
  if (mlNeeded < 0.25) {
    dosageOutput = `<strong>${drops} Drops</strong>`;
  } else if (mlNeeded < 1.0) {
    dosageOutput = `<strong>${mlNeeded.toFixed(2)} ml</strong> / ${drops} Drops`;
  } else {
    dosageOutput = `<strong>${mlNeeded.toFixed(1)} ml</strong>`;
  }

  // --- Step 4: Final Output (consistent styled result box) ---
  res.innerHTML = `
        Recommended Dosage: ${dosageOutput}<br>
        <span style="font-size: 0.9rem; color: #334e68;">
            Estimated for ${productData.instructions} 
            <strong>Check your specific product label!</strong>
        </span>
    `;
}

// --- Global Setup & Keyboard Support ---

// Trigger calculation when pressing Enter (consistent UX)
document.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    calculateDosage();
  }
});

function clearAll() {
  // Reset dropdowns to default (polish carried over)
  document.getElementById("unit").value = "us";
  document.getElementById("chemical-type").value = "fertilizer";

  // Clear main input/result
  document.getElementById("tank-vol").value = "";
  document.getElementById("result").innerText = "";
}
