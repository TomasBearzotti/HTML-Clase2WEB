document.addEventListener("DOMContentLoaded", () => {
  const headerDate = document.getElementById("header-date");
  const form = document.getElementById("subscriptionForm");
  const feedbackDialog = document.getElementById("feedbackDialog");
  const feedbackTitle = document.getElementById("feedbackTitle");
  const feedbackContent = document.getElementById("feedbackContent");
  const nameInput = document.getElementById("nombre-completo");
  const loginDialog = document.getElementById("loginDialog");
  const subscriptionTitle = document.getElementById("subscriptionTitle");
  const nameGreeting = document.getElementById("nameGreeting");

  if (
    !headerDate ||
    !form ||
    !feedbackDialog ||
    !feedbackTitle ||
    !feedbackContent ||
    !nameInput ||
    !loginDialog ||
    !subscriptionTitle ||
    !nameGreeting
  ) {
    return;
  }

  headerDate.textContent = new Intl.DateTimeFormat("es-AR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const fieldConfigs = {
    "nombre-completo": {
      label: "Nombre completo",
      message: "Debe tener más de 6 letras y al menos un espacio entre medio.",
      validate: (value) => {
        const normalized = value.trim();
        const namePattern =
          /^[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+(?:\s+[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]+)+$/;

        return normalized.length > 6 && namePattern.test(normalized);
      },
    },
    email: {
      label: "Email",
      message: "Debe tener un formato de email válido.",
      validate: (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim()),
    },
    password: {
      label: "Contraseña",
      message: "Debe tener al menos 8 caracteres, con letras y números.",
      validate: (value) => /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(value),
    },
    "repeat-password": {
      label: "Repetir contraseña",
      message: "Las contraseñas deben coincidir.",
      validate: (value) =>
        value === document.getElementById("password").value && value.length > 0,
    },
    edad: {
      label: "Edad",
      message: "Debe ser un número entero mayor o igual a 18.",
      validate: (value) => {
        if (!/^\d+$/.test(value.trim())) {
          return false;
        }

        return Number.parseInt(value, 10) >= 18;
      },
    },
    telefono: {
      label: "Teléfono",
      message:
        "Debe tener al menos 7 dígitos y no puede contener espacios, guiones ni paréntesis.",
      validate: (value) => /^\d{7,}$/.test(value.trim()),
    },
    direccion: {
      label: "Dirección",
      message:
        "Debe tener al menos 5 caracteres, con letras, números y un espacio en el medio.",
      validate: (value) => {
        const normalized = value.trim();
        return (
          normalized.length >= 5 &&
          /[A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/.test(normalized) &&
          /\d/.test(normalized) &&
          /\s/.test(normalized)
        );
      },
    },
    ciudad: {
      label: "Ciudad",
      message: "Debe tener al menos 3 caracteres.",
      validate: (value) => value.trim().length >= 3,
    },
    "codigo-postal": {
      label: "Código postal",
      message: "Debe tener al menos 3 caracteres.",
      validate: (value) => value.trim().length >= 3,
    },
    dni: {
      label: "DNI",
      message: "Debe ser un número de 7 u 8 dígitos.",
      validate: (value) => /^\d{7,8}$/.test(value.trim()),
    },
  };

  const fieldIds = Object.keys(fieldConfigs);

  const getField = (fieldId) => document.getElementById(fieldId);
  const getErrorElement = (fieldId) =>
    document.getElementById(`error-${fieldId}`);

  const setError = (fieldId, message) => {
    const input = getField(fieldId);
    const errorElement = getErrorElement(fieldId);

    if (!input || !errorElement) {
      return;
    }

    errorElement.textContent = message;
    input.classList.add("input-error");
    input.setAttribute("aria-invalid", "true");
  };

  const clearError = (fieldId) => {
    const input = getField(fieldId);
    const errorElement = getErrorElement(fieldId);

    if (!input || !errorElement) {
      return;
    }

    errorElement.textContent = "";
    input.classList.remove("input-error");
    input.removeAttribute("aria-invalid");
  };

  const validateField = (fieldId) => {
    const input = getField(fieldId);
    const config = fieldConfigs[fieldId];

    if (!input || !config) {
      return true;
    }

    const isValid = config.validate(input.value);

    if (!isValid) {
      setError(fieldId, config.message);
      return false;
    }

    clearError(fieldId);
    return true;
  };

  const isValidName = () =>
    fieldConfigs["nombre-completo"].validate(nameInput.value);

  const updateNameGreeting = () => {
    const currentName = nameInput.value.trim();
    nameGreeting.textContent = isValidName()
      ? `HOLA ${currentName.toUpperCase()}`
      : "";
    nameGreeting.classList.toggle("is-visible", isValidName());
  };

  const renderFeedback = (titleText, items) => {
    feedbackTitle.textContent = titleText;
    feedbackContent.innerHTML = "";

    if (items.length === 1) {
      const paragraph = document.createElement("p");
      paragraph.textContent = items[0];
      feedbackContent.appendChild(paragraph);
    } else {
      const list = document.createElement("ul");
      items.forEach((item) => {
        const listItem = document.createElement("li");
        listItem.textContent = item;
        list.appendChild(listItem);
      });
      feedbackContent.appendChild(list);
    }

    if (feedbackDialog.open) {
      feedbackDialog.close();
    }

    feedbackDialog.showModal();
  };

  fieldIds.forEach((fieldId) => {
    const input = getField(fieldId);

    if (!input) {
      return;
    }

    input.addEventListener("blur", () => {
      validateField(fieldId);
      if (fieldId === "nombre-completo") {
        updateNameGreeting();
      }
    });

    input.addEventListener("focus", () => {
      clearError(fieldId);
      if (fieldId === "nombre-completo") {
        updateNameGreeting();
      }
    });
  });

  nameInput.addEventListener("input", updateNameGreeting);
  nameInput.addEventListener("keydown", () => {
    window.setTimeout(updateNameGreeting, 0);
  });

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const errors = [];
    const submittedData = {};

    fieldIds.forEach((fieldId) => {
      const input = getField(fieldId);
      const config = fieldConfigs[fieldId];

      if (!input || !config) {
        return;
      }

      const isValid = validateField(fieldId);

      if (!isValid) {
        errors.push(`${config.label}: ${config.message}`);
      } else {
        submittedData[fieldId] = input.value.trim();
      }
    });

    if (errors.length > 0) {
      renderFeedback("Revisá estos errores", errors);
      return;
    }

    const summary = [
      `Nombre completo: ${submittedData["nombre-completo"]}`,
      `Email: ${submittedData.email}`,
      `Edad: ${submittedData.edad}`,
      `Teléfono: ${submittedData.telefono}`,
      `Dirección: ${submittedData.direccion}`,
      `Ciudad: ${submittedData.ciudad}`,
      `Código postal: ${submittedData["codigo-postal"]}`,
      `DNI: ${submittedData.dni}`,
    ];

    form.reset();
    fieldIds.forEach(clearError);
    updateNameGreeting();
    loginDialog.close();
    renderFeedback("Suscripción enviada", summary);
  });

  updateNameGreeting();
});
