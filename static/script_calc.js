async function calculateTotalsFromAPI() {
  const response = await fetch('http://localhost:8001/obtener_representantes/');
  const data = await response.json();

  const totalCapacidad_vf = [
      { nombre: 'Climaterio', Hera: 0, Atenea: 0 },
      { nombre: 'Obstetricia', Hera: 0, Atenea: 0 },
      { nombre: 'Ginecologia', Hera: 0, Atenea: 0 }
  ];

  data.forEach(rep => {
      const bu = rep.BU;
      const tipo = rep.Tipo;
      const value = Number(rep.Reps) || 0;

      const categoria = totalCapacidad_vf.find(area => area.nombre === bu);
      if (categoria) {
          if (tipo === "Hera") {
              categoria.Hera += value * 3 * 12 * 220;
          } else {
              categoria.Atenea += value * 3 * 12 * 210;
          }
      }
  });

  const formatNumber = num => num.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  const totalCapTotal_v2 = totalCapacidad_vf.reduce((sum, area) => sum + area.Hera + area.Atenea, 0);
  const totalCapHera = totalCapacidad_vf.reduce((sum, area) => sum + area.Hera, 0);
  const totalCapAtenea = totalCapacidad_vf.reduce((sum, area) => sum + area.Atenea, 0);

  const totalClim  = totalCapacidad_vf.find(area => area.nombre === 'Climaterio') || { Hera: 0, Atenea: 0 };
  const totalObste = totalCapacidad_vf.find(area => area.nombre === 'Obstetricia') || { Hera: 0, Atenea: 0 };
  const totalGine  = totalCapacidad_vf.find(area => area.nombre === 'Ginecologia') || { Hera: 0, Atenea: 0 };

  document.getElementById("resultadoTotal").value = formatNumber(totalCapTotal_v2);
  document.getElementById("resultadoTotal-Hera").value = formatNumber(totalCapHera);
  document.getElementById("resultadoTotal-Atenea").value = formatNumber(totalCapAtenea);

  document.getElementById("resultadoClim").value = formatNumber(totalClim.Hera + totalClim.Atenea);
  document.getElementById("resultadoClim-Hera").value = formatNumber(totalClim.Hera);
  document.getElementById("resultadoClim-Atenea").value = formatNumber(totalClim.Atenea);

  document.getElementById("resultadoObste").value = formatNumber(totalObste.Hera + totalObste.Atenea);
  document.getElementById("resultadoObste-Hera").value = formatNumber(totalObste.Hera);
  document.getElementById("resultadoObste-Atenea").value = formatNumber(totalObste.Atenea);

  document.getElementById("resultadoGine").value = formatNumber(totalGine.Hera + totalGine.Atenea);
  document.getElementById("resultadoGine-Hera").value = formatNumber(totalGine.Hera);
  document.getElementById("resultadoGine-Atenea").value = formatNumber(totalGine.Atenea);
}


async function calcularDatos() {
    await calculateTotalsFromAPI(); // espera que termine antes de continuar
    const btn = document.getElementById("btn-calcular");
    const spinner = document.getElementById("spinner");
    const timerDisplay = document.getElementById("timer");
    const timerMins = document.getElementById("timer-mins");
    const timerSecs = document.getElementById("timer-secs");

    let seconds = 0;
    let minutes = 0;
    let timerInterval;

    // Función para actualizar el temporizador
    function startTimer() {
        timerInterval = setInterval(() => {
            seconds++;
            if (seconds === 60) {
                minutes++;
                seconds = 0;
            }
            timerMins.textContent = String(minutes).padStart(2, '0');
            timerSecs.textContent = String(seconds).padStart(2, '0');
        }, 1000);
    }


    // Mostrar spinner y desactivar botón
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
    spinner.classList.remove("hidden");
    timerDisplay.classList.remove("hidden");

    // Iniciar el temporizador
    startTimer();


    const tablaTotBody = document.getElementById("tabla-tot-body");
    const tablaClimBody = document.getElementById("tabla-clim-body");
    const tablaGineBody = document.getElementById("tabla-gine-body");
    const tablaObsteBody = document.getElementById("tabla-obste-body");
    const miniTablaTotBody = document.getElementById("mini-tabla-tot");
    const miniTablaClimBody = document.getElementById("mini-tabla-clim");
    const miniTablaGineBody = document.getElementById("mini-tabla-obste");
    const miniTablaObsteBody = document.getElementById("mini-tabla-gine");

  
 // Crear tabla completa
    function renderTabla(datos, targetBody) {
    targetBody.innerHTML = ""; // Limpiar por si ya hay algo

    const formatNum = (num, decimals = 0) => {
      return typeof num === "number"
        ? num.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })
        : num;
    };

    const formatNumpar = (num, decimals = 1) => {
      return typeof num === "number"
        ? num.toLocaleString("en-US", {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals
        })
        : num;
    };

    datos.forEach(producto => {
      const row = document.createElement("tr");
      row.innerHTML = `
            <td class="border-b p-2" min-w-[190px]>${producto.Producto}</td>
            <td class="border-b p-2 text-center">${formatNum(producto.Contactos_Ponderados_P1)}</td>
            <td class="border-b p-2 text-center">${formatNum(producto.Contactos_PPI_P1)}</td>
            <td class="border-b p-2 text-center">${formatNumpar(producto["%_Participacion_PPI_P1"])}%</td>
            <td class="border-b p-2 text-center">${formatNum(producto.Representantes_P1)}</td>
            <td class="border-b p-2 text-center">${formatNumpar(producto.Reach_P1)}%</td>
            <td class="border-b p-1 bg-gray-100"></td> <!-- Celda en blanco añadida aquí -->
            <td class="border-b p-2 text-center">${formatNum(producto.Contactos_Ponderados_P2)}</td>
            <td class="border-b p-2 text-center">${formatNum(producto.Contactos_PPI_P2)}</td>
            <td class="border-b p-2 text-center">${formatNumpar(producto["%_Participacion_PPI_P2"])}%</td>
            <td class="border-b p-2 text-center">${formatNum(producto.Representantes_P2)}</td>
            <td class="border-b p-2 text-center">${formatNumpar(producto.Reach_P2)}%</td>
            <td class="border-b p-1 bg-gray-100"></td> <!-- Celda en blanco añadida aquí -->
            <td class="border-b p-2 text-center ${producto.Variacion_Ponderado > 0.15 ? 'text-red-600' : producto.Variacion_Ponderado < -0.15 ? 'text-red-600' : ''}">
              ${formatNumpar(producto.Variacion_Ponderado * 100)}%
            </td>
            <td class="border-b p-2 text-center ${producto.Variacion_PPI > 0.15 ? 'text-red-600' : producto.Variacion_PPI < -0.15 ? 'text-red-600' : ''}">
              ${formatNumpar(producto.Variacion_PPI * 100)}%
            </td>
          `;
      targetBody.appendChild(row);
    });
  }

      const renderTabla_Tot = (datos, targetBody) => {
        targetBody.innerHTML = ""; // Limpiar por si ya hay algo
    
        const formatNum = (num, decimals = 0) => {
            return typeof num === "number"
                ? num.toLocaleString("en-US", {
                    minimumFractionDigits: decimals,
                    maximumFractionDigits: decimals
                })
                : num;
        };

        const formatNumpar = (num, decimals = 1) => {
          return typeof num === "number"
            ? num.toLocaleString("en-US", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals
            })
            : num;
        };
    
        // Crear una única fila para los totales
        const row = document.createElement("tr");
        row.innerHTML = `
            <td class="border-b p-2 font-bold text-center min-w-[190px]">Totales</td>
            <td class="border-b p-2 text-center">${formatNum(datos.Total_Pond_P1)}</td>
            <td class="border-b p-2 text-center">${formatNum(datos.Total_PPI_P1)}</td>
            <td class="border-b p-2 text-center">100.0%</td>
            <td class="border-b p-2 text-center">${formatNum(datos.Total_Reps_p1)}</td>
            <td class="border-b p-2 text-center">${formatNumpar(datos.Reach_P1)}%</td>
            <td class="border-b p-1"></td> <!-- Celda en blanco añadida aquí -->
            <td class="border-b p-2 text-center">${formatNum(datos.Total_Pond_P2)}</td>
            <td class="border-b p-2 text-center">${formatNum(datos.Total_PPI_P2)}</td>
            <td class="border-b p-2 text-center">100.0%</td>
            <td class="border-b p-2 text-center">${formatNum(datos.Total_Reps_p2)}</td>
            <td class="border-b p-2 text-center">${formatNumpar(datos.Reach_P2)}%</td>
            <td class="border-b p-1"></td> <!-- Celda en blanco añadida aquí -->
            <td class="border-b p-2 text-center ${datos.Variacion_Pond > 15 ? 'text-red-600' : datos.Variacion_Pond < -15 ? 'text-red-600' : ''}">
                ${formatNumpar(datos.Variacion_Pond)}%
            </td>
            <td class="border-b p-2 text-center ${datos.Variacion_PPI > 15 ? 'text-red-600' : datos.Variacion_PPI < -15 ? 'text-red-600' : ''}">
                ${formatNumpar(datos.Variacion_PPI)}%
            </td>
        `;
        targetBody.appendChild(row);

        document.getElementById("btn-exportar").classList.remove("hidden");
    };



    // Obtener los valores de los totales

      const url = `http://localhost:8001/calcular`;
  
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const data = await response.json();
    
    
        renderTabla(data.tabla_tot, tablaTotBody);
        renderTabla(data.tabla_clim, tablaClimBody);
        renderTabla(data.tabla_gine, tablaGineBody);
        renderTabla(data.tabla_obste, tablaObsteBody);
        renderTabla_Tot(data.totales_tot, miniTablaTotBody);
        renderTabla_Tot(data.totales_clim, miniTablaClimBody);
        renderTabla_Tot(data.totales_gine, miniTablaGineBody);
        renderTabla_Tot(data.totales_obste, miniTablaObsteBody);


      } catch (error) {
        console.error("Error al obtener datos:", error);
        alert("Ocurrió un error al obtener los datos. Revisa la consola.");
      } finally {
        // Detener el temporizador
        clearInterval(timerInterval);


        // Ocultar spinner y reactivar botón
        btn.disabled = false;
        btn.classList.remove("opacity-50", "cursor-not-allowed");
        spinner.classList.add("hidden");
      }

      fetch("http://localhost:8001/api/parrillas")
      .then(response => response.json())
      .then(data => {
        llenarDatosDesdeApi(data);
      })
      .catch(error => console.error("Error cargando datos:", error));

    }

    function exportarTablaAExcel() {
      const wb = XLSX.utils.book_new();
    
      const tablas = [
        { id: "tabla-tot-body", name: "Total" },
        { id: "tabla-clim-body", name: "Climaterio" },
        { id: "tabla-gine-body", name: "Ginecología" },
        { id: "tabla-obste-body", name: "Obstetricia" }
      ];
    
      tablas.forEach(tablaInfo => {
        const tabla = document.getElementById(tablaInfo.id);
        if (!tabla) return;
    
        // Clonar tabla completa (padre de tbody) para exportar encabezados también
        const tablaCompleta = tabla.closest("table");
        const ws = XLSX.utils.table_to_sheet(tablaCompleta);
        XLSX.utils.book_append_sheet(wb, ws, tablaInfo.name);
      });
    
      XLSX.writeFile(wb, "Comparativa_Productos.xlsx");
    }

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-calcular").addEventListener("click", calcularDatos);
  document.getElementById("btn-exportar").addEventListener("click", exportarTablaAExcel);
});
  
function llenarDatosBU(parrilla, BU, rank1, rank2, rank3) {
  const r1 = Number(rank1) || 0;
  const r2 = Number(rank2) || 0;
  const r3 = Number(rank3) || 0;
  const total = r1 + r2 + r3;

  const pct = (val) => total ? ((val / total) * 100).toFixed(1) + "%" : "0.0%";
  const fmt = (val) => Math.round(val).toLocaleString("en-US");

  document.getElementById(`PPI-1-P${parrilla}-${BU}`).value = `${fmt(r1)} (${pct(r1)})`;
  document.getElementById(`PPI-2-P${parrilla}-${BU}`).value = `${fmt(r2)} (${pct(r2)})`;
  document.getElementById(`PPI-3-P${parrilla}-${BU}`).value = `${fmt(r3)} (${pct(r3)})`;

  const totalField = document.getElementById(`PPI-Total-P${parrilla}-${BU}`);
  if (totalField) {
    totalField.value = `${fmt(total)} (100.0%)`;
  }
}

function actualizarTotalesExeltis() {
  const p1 = ["climaterio", "ginecologia", "obstetricia"];

  const getSum = (rank, parrilla, p) => 
    p.reduce((sum, bu) => {
      const el = document.getElementById(`PPI-${rank}-P${parrilla}-${bu}`);
      const val = el ? Number(el.value.split(" ")[0].replace(/\./g, "").replace(/,/g, "")) : 0;
      return sum + (val || 0);
    }, 0);

  const fmt = (val) => Math.round(val).toLocaleString("en-US");

  // Parrilla 1
  const total1_1 = getSum(1, 1, p1);
  const total2_1 = getSum(2, 1, p1);
  const total3_1 = getSum(3, 1, p1);
  const totalP1 = total1_1 + total2_1 + total3_1;

  const pct = (val) => totalP1 ? ((val / totalP1) * 100).toFixed(1) + "%" : "0.0%";

  document.getElementById("PPI-1-P1").value = `${fmt(total1_1)} (${pct(total1_1)})`;
  document.getElementById("PPI-2-P1").value = `${fmt(total2_1)} (${pct(total2_1)})`;
  document.getElementById("PPI-3-P1").value = `${fmt(total3_1)} (${pct(total3_1)})`;
  document.getElementById("PPI-Total-P1").value = `${fmt(totalP1)} (100.0%)`;

  // Parrilla 2
  const total1_2 = getSum(1, 2, p1);
  const total2_2 = getSum(2, 2, p1);
  const total3_2 = getSum(3, 2, p1);
  const totalP2 = total1_2 + total2_2 + total3_2;

  const pct2 = (val) => totalP2 ? ((val / totalP2) * 100).toFixed(1) + "%" : "0.0%";

  document.getElementById("PPI-1-P2").value = `${fmt(total1_2)} (${pct2(total1_2)})`;
  document.getElementById("PPI-2-P2").value = `${fmt(total2_2)} (${pct2(total2_2)})`;
  document.getElementById("PPI-3-P2").value = `${fmt(total3_2)} (${pct2(total3_2)})`;
  document.getElementById("PPI-Total-P2").value = `${fmt(totalP2)} (100.0%)`;
}




// Función que recibe el JSON (igual al que regresa tu API) y llena toda la tabla
function llenarDatosDesdeApi(data) {
  // Itera cada parrilla (Parrilla_1, Parrilla_2)
  for (const parrillaKey in data) {
    const items = data[parrillaKey];
    items.forEach(item => {
      // item.BU: climaterio, ginecologia, obstetricia
      // item.Rank1, Rank2, Rank3
      const parrillaNum = parrillaKey.split("_")[1]; // '1' o '2'
      llenarDatosBU(parrillaNum, item.BU, item.Rank1, item.Rank2, item.Rank3);
    });
  }
  actualizarTotalesExeltis();
}


  async function cargarPeriodos() {
    try {
      const response = await fetch('http://localhost:8001/periodos2'); // Ajusta la URL si es necesario
      const data = await response.json();
      document.getElementById('Par_1').textContent = data.Par_1;
      document.getElementById('Par_2').textContent = data.Par_2;
      document.getElementById('Par_3').textContent = data.Par_1;
      document.getElementById('Par_4').textContent = data.Par_2;
      document.getElementById('Par_5').textContent = data.Par_1;
      document.getElementById('Par_6').textContent = data.Par_2;
      document.getElementById('Par_7').textContent = data.Par_1;
      document.getElementById('Par_8').textContent = data.Par_2;
    } catch (error) {
      console.error("Error al cargar los periodos:", error);
    }
  }

  // Ejecutar al cargar la página
  window.onload = cargarPeriodos;
