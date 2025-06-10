const API_URL = "http://localhost:8001";

async function cargarPeriodos() {
  const response = await fetch(`${API_URL}/periodos`);
  const periodos = await response.json();
  const select = document.getElementById('periodo');

  periodos.forEach(periodo => {
    const option = document.createElement('option');
    option.value = periodo;
    option.textContent = periodo;
    select.appendChild(option);
  });
}

async function cargarPeriodos2() {
  const response2 = await fetch(`${API_URL}/periodos`);
  const periodos2 = await response2.json();
  const select2 = document.getElementById('periodo2');

  periodos2.forEach(periodo2 => {
    const option2 = document.createElement('option');
    option2.value = periodo2;
    option2.textContent = periodo2;
    select2.appendChild(option2);
  });
}


async function consultarMdo() {
  const periodo = document.getElementById('periodo').value;
  const periodo2 = document.getElementById('periodo2').value;

  // Verificamos si los datos están en el cache
  let mdoList = JSON.parse(localStorage.getItem(`mercados_${periodo}`));
  let mdoList2 = JSON.parse(localStorage.getItem(`mercados_${periodo2}`));

  // Si no están en el cache, hacer fetch y guardarlos
  if (!mdoList) {
    const response = await fetch(`${API_URL}/mdo/${periodo}`);
    mdoList = await response.json();
    localStorage.setItem(`mercados_${periodo}`, JSON.stringify(mdoList));
  }

  if (!mdoList2) {
    const response2 = await fetch(`${API_URL}/mdo/${periodo2}`);
    mdoList2 = await response2.json();
    localStorage.setItem(`mercados_${periodo2}`, JSON.stringify(mdoList2));
  }

  // Actualizar las tablas
  const tabla = document.getElementById('tabla-mdo');
  const tabla2 = document.getElementById('tabla-mdo-2');
  tabla.innerHTML = "";
  tabla2.innerHTML = "";

  mdoList.forEach((mdo, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border px-4 py-2 text-center">${index + 1}</td>
      <td class="border px-4 py-2">${mdo}</td>
    `;
    tabla.appendChild(row);
  });

  const total1 = document.createElement('tr');
  total1.innerHTML = `
    <td colspan="2" class="border-t px-4 py-2 font-bold text-right text-blue-700">
      Total mercados: ${mdoList.length}
    </td>
  `;
  tabla.appendChild(total1);

  mdoList2.forEach((mdo, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td class="border px-4 py-2 text-center">${index + 1}</td>
      <td class="border px-4 py-2">${mdo}</td>
    `;
    tabla2.appendChild(row);
  });

  const total2 = document.createElement('tr');
  total2.innerHTML = `
    <td colspan="2" class="border-t px-4 py-2 font-bold text-right text-green-700">
      Total mercados: ${mdoList2.length}
    </td>
  `;
  tabla2.appendChild(total2);

  // Actualizar tarjetas resumen
  document.getElementById('total1').textContent = `Total mercados: ${mdoList.length}`;
  document.getElementById('total2').textContent = `Total mercados: ${mdoList2.length}`;

  // Nueva línea que agregamos aquí:
  await lectura();
  await lectura2();
}

async function lectura() {
  const peri = document.getElementById('periodo').value;
  const response = await fetch(`${API_URL}/datos/${peri}`);
  const data = await response.json();
  const fila = data[0];

  document.getElementById('fichero').textContent = `Fichero: ${fila.Fichero_mod}`;
  document.getElementById('ficheroD').textContent = `Fichero: ${fila.Fichero_Desp}`;
  document.getElementById('Parrilla').textContent = `Parrilla: ${fila.Parrilla}`;
  document.getElementById('Peri').textContent = `Periodo: ${fila.Periodo}`;
  document.getElementById('Conge').textContent = `Congeladora: ${fila.Congeladora}`;

  datosLectura1 = fila;
}

async function lectura2() {
  const peri2 = document.getElementById('periodo2').value;
  const response2 = await fetch(`${API_URL}/datos/${peri2}`);
  const data2 = await response2.json();
  const fila2 = data2[0];

  document.getElementById('fichero2').textContent = `Fichero: ${fila2.Fichero_mod}`;
  document.getElementById('ficheroD2').textContent = `Fichero: ${fila2.Fichero_Desp}`;
  document.getElementById('Parrilla2').textContent = `Parrilla: ${fila2.Parrilla}`;
  document.getElementById('Peri2').textContent = `Periodo: ${fila2.Periodo}`;
  document.getElementById('Conge2').textContent = `Congeladora: ${fila2.Congeladora}`;

  datosLectura2 = fila2;
}

async function guardarEnSQL() {
  const payload = {
    periodoA: datosLectura1.Periodo,
    ficheroA: datosLectura1.Fichero_mod,
    ficheroDespA: datosLectura1.Fichero_Desp,
    parrillaA: datosLectura1.Parrilla,
    congeA: datosLectura1.Congeladora,
    periodoB: datosLectura2.Periodo,
    ficheroB: datosLectura2.Fichero_mod,
    ficheroDespB: datosLectura2.Fichero_Desp,
    parrillaB: datosLectura2.Parrilla,
    congeB: datosLectura2.Congeladora
  };

  console.log(payload)

  const response = await fetch(`${API_URL}/guardar-config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (response.ok) {
    alert('Datos guardados en la base de datos correctamente!');
  } else {
    alert('Error al guardar los datos.');
  }
}

async function enviarDatos() {
  // Primero, enviar y guardar en SQL
  await guardarEnSQL();

  // Luego, limpiar los objetos locales
  datosLectura1 = {};
  datosLectura2 = {};

}



//Cargar ambos al cargar la página
window.onload = function() {
  cargarPeriodos();
  cargarPeriodos2();
};