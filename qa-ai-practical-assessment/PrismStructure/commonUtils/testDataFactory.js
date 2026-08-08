/**
 * Builds unique Toolshop user payloads for UI/API tests.
 * Password avoids common leaked lists; email uses timestamp for isolation.
 */
function buildUniqueUser(prefix = "qa") {
  const stamp = Date.now();
  return {
    first_name: "Qa",
    last_name: "Auto",
    dob: "1990-01-01",
    address: {
      street: "Zoey Shore",
      city: "Hesselbury",
      state: "Florida",
      country: "TG",
      postal_code: "1234AA",
      house_number: "12",
    },
    phone: "5551234567",
    email: `${prefix}.${stamp}@mailinator.com`,
    password: "Sup3rSecur3!Qa#2026",
  };
}

const billingAddress = {
  billing_street: "Zoey Shore",
  billing_city: "Hesselbury",
  billing_state: "Florida",
  billing_country: "TG",
  billing_postal_code: "1234AA",
  payment_method: "cash-on-delivery",
  payment_details: {},
};

module.exports = { buildUniqueUser, billingAddress };
