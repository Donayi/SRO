function calculateTotals_2() { 
  const inputs = document.querySelectorAll('input[type="number"]');

  const totalCapacidad_vf = [
      { nombre: 'Climaterio', Hera: 0, Atenea: 0 },
      { nombre: 'Obstetricia', Hera: 0, Atenea: 0 },
      { nombre: 'Ginecologia', Hera: 0, Atenea: 0 }
  ];

  inputs.forEach(input => {
      const bu = input.dataset.bu;
      const tipo = input.dataset.tipo;
      const value = Number(input.value) || 0;
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

  // Cálculo de totales
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
    calculateTotals_2(); // <- Ejecuta antes de seguir con la lógica
    const btn = document.getElementById("btn-calcular");
    const btn_2 = document.getElementById("btn-guardar-contactos");
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
    btn_2.disabled = true;
    btn_2.classList.add("opacity-50","cursor-not-allowed");
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
    };



    // Obtener los valores de los totales
    const climaterio = document.getElementById("total-Climaterio").textContent;
    const ginecologia = document.getElementById("total-Ginecologia").textContent;
    const obstetricia = document.getElementById("total-Obstetricia").textContent;

      const url = `http://localhost:8001/calcular?climaterio=${climaterio}&ginecologia=${ginecologia}&obstetricia=${obstetricia}`;
  
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
        btn_2.disabled = false;
        btn_2.classList.remove("opacity-50", "cursor-not-allowed")

        spinner.classList.add("hidden");
      }
    }
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("btn-calcular").addEventListener("click", calcularDatos);
});
  
function calculateTotals() {
  const inputs = document.querySelectorAll('input[type="number"]');
  const totals = {
      'Climaterio': 0,
      'Ginecologia': 0,
      'Obstetricia': 0
  };
  let totalExeltis = 0;

  inputs.forEach(input => {
      const bu = input.dataset.bu;
      const value = parseInt(input.value) || 0;
      totals[bu] += value;
      totalExeltis += value; // Sumar todos los valores para Exeltis
  });

  // Actualizar los totales en la tabla derecha
  Object.keys(totals).forEach(bu => {
      document.getElementById(`total-${bu}`).textContent = totals[bu];
  });
  
  // Actualizar el total de Representantes Exeltis
  document.getElementById('reps-Exeltis').textContent = totalExeltis;
}

// Inicializar con ceros
calculateTotals();


document.getElementById("btn-guardar-contactos").addEventListener("click", async function () {
  const inputs = document.querySelectorAll('input[type="number"]');
  let data = [];

  inputs.forEach(input => {
      const bu = input.dataset.bu;
      const tipo = input.dataset.tipo;
      const reps = parseInt(input.value) || 0;

      if (bu && tipo) {
          data.push({ BU: bu, Tipo: tipo, Reps: reps });
      }
  });

  if (data.length === 0) {
      alert("No hay datos para guardar.");
      return;
  }

  try {
      const response = await fetch("http://localhost:8001/guardar_representantes/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data)
      });

      const result = await response.json();
      if (response.ok) {
          alert("Datos guardados correctamente.");
      } else {
          alert("Error al guardar: " + result.detail);
      }
  } catch (error) {
      console.error("Error en la solicitud:", error);
      alert("Ocurrió un error en la conexión.");
  }
});

async function cargarRepresentantes() {
  try {
      const response = await fetch("http://localhost:8001/obtener_representantes/");
      if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
      
      const representantes = await response.json();
      
      // Llenar los inputs con los valores guardados en SQL
      representantes.forEach(rep => {
          const input = document.querySelector(`[data-bu="${rep.BU}"][data-tipo="${rep.Tipo}"]`);
          if (input) input.value = rep.Reps;
      });

      // Recalcular totales
      calculateTotals();

  } catch (error) {
      console.error("Error al obtener datos guardados:", error);
  }
}

// Llamar a la función cuando cargue la página
document.addEventListener("DOMContentLoaded", cargarRepresentantes);
