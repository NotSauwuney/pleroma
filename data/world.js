/* ============================================================
   MUNDO  —  zonas, conexiones, localizaciones
   ------------------------------------------------------------
   id, bioma (clave de GD.enemyPools), encuentro (prob 0..1)
   nombre: string o {es,en}
   descripcion: una variante {es,en} O un ARRAY de variantes (se elige una
                al azar cada vez que mirás la zona) -> el lugar se siente vivo
   salidas[].texto: string o {es,en}
   lugares: acciones especiales no-combate (posada, tienda, descanso...)
   inicio: id de la zona donde nace y reaparece (al morir) el jugador.
   ============================================================ */
window.GD = window.GD || {};

GD.world = {
  inicio: "vado",

  zonas: {
    vado: {
      id: "vado", bioma: null, encuentro: 0,
      nombre: "@@world.zonas.vado.nombre",
      descripcion: [
        "@@world.zonas.vado.descripcion.0",
        "@@world.zonas.vado.descripcion.1",
        "@@world.zonas.vado.descripcion.2",
      ],
      salidas: [
        { a: "senda",   texto: "@@world.zonas.vado.salidas.0.texto" },
        { a: "llano",   texto: "@@world.zonas.vado.salidas.1.texto" },
        { a: "granjas", texto: "@@world.zonas.vado.salidas.2.texto" },
      ],
      lugares: ["posada", "tienda", "herreria", "descanso"],
      eventos: [
        "@@world.zonas.vado.eventos.0",
        "@@world.zonas.vado.eventos.1",
        "@@world.zonas.vado.eventos.2",
      ],
    },

    granjas: {
      id: "granjas", bioma: null, encuentro: 0,
      nombre: "@@world.zonas.granjas.nombre",
      descripcion: [
        "@@world.zonas.granjas.descripcion.0",
        "@@world.zonas.granjas.descripcion.1",
        "@@world.zonas.granjas.descripcion.2",
      ],
      salidas: [
        { a: "vado", texto: "@@world.zonas.granjas.salidas.0.texto" },
      ],
      lugares: ["granja", "descanso", "forrajear"],
      forrajeoGranja: [
        "huevo", "huevo", "zanahoria", "zanahoria", "nabo", "nabo",
        "harina", "manteca", "leche_fresca", "miel_granja", "sal",
      ],
      eventos: [
        "@@world.zonas.granjas.eventos.0",
        "@@world.zonas.granjas.eventos.1",
        "@@world.zonas.granjas.eventos.2",
        "@@world.zonas.granjas.eventos.3",
        "@@world.zonas.granjas.eventos.4",
      ],
    },

    senda: {
      id: "senda", bioma: "bosque", encuentro: 0.6, nivelMax: 4,
      nombre: "@@world.zonas.senda.nombre",
      descripcion: [
        "@@world.zonas.senda.descripcion.0",
        "@@world.zonas.senda.descripcion.1",
        "@@world.zonas.senda.descripcion.2",
      ],
      salidas: [
        { a: "vado", texto: "@@world.zonas.senda.salidas.0.texto" },
        { a: "claro", texto: "@@world.zonas.senda.salidas.1.texto" },
      ],
      lugares: ["descanso", "forrajear"],
      materialForajeo: ["zarpa_osa", "colmillo_lobo"],
      eventos: [
        "@@world.zonas.senda.eventos.0",
        "@@world.zonas.senda.eventos.1",
        "@@world.zonas.senda.eventos.2",
        "@@world.zonas.senda.eventos.3",
      ],
    },

    claro: {
      id: "claro", bioma: "pantano", encuentro: 0.7, nivelMax: 6,
      nombre: "@@world.zonas.claro.nombre",
      descripcion: [
        "@@world.zonas.claro.descripcion.0",
        "@@world.zonas.claro.descripcion.1",
        "@@world.zonas.claro.descripcion.2",
      ],
      salidas: [
        { a: "senda",      texto: "@@world.zonas.claro.salidas.0.texto" },
        { a: "cueva_vadak", texto: "@@world.zonas.claro.salidas.1.texto" },
      ],
      lugares: ["descanso", "forrajear"],
      materialForajeo: ["baba_pantano", "escama_hidra"],
      eventos: [
        "@@world.zonas.claro.eventos.0",
        "@@world.zonas.claro.eventos.1",
        "@@world.zonas.claro.eventos.2",
      ],
    },

    cueva_vadak: {
      id: "cueva_vadak", bioma: null, encuentro: 0,
      nombre: "@@world.zonas.cueva_vadak.nombre",
      descripcion: [
        "@@world.zonas.cueva_vadak.descripcion.0",
        "@@world.zonas.cueva_vadak.descripcion.1",
        "@@world.zonas.cueva_vadak.descripcion.2",
      ],
      salidas: [
        { a: "claro", texto: "@@world.zonas.cueva_vadak.salidas.0.texto" },
      ],
      lugares: ["escuela_plenitud", "descanso"],
      eventos: [
        "@@world.zonas.cueva_vadak.eventos.0",
        "@@world.zonas.cueva_vadak.eventos.1",
        "@@world.zonas.cueva_vadak.eventos.2",
        "@@world.zonas.cueva_vadak.eventos.3",
      ],
    },

    llano: {
      id: "llano", bioma: "llanura", encuentro: 0.55, nivelMax: 7,
      nombre: "@@world.zonas.llano.nombre",
      descripcion: [
        "@@world.zonas.llano.descripcion.0",
        "@@world.zonas.llano.descripcion.1",
        "@@world.zonas.llano.descripcion.2",
      ],
      salidas: [
        { a: "vado", texto: "@@world.zonas.llano.salidas.0.texto" },
        { a: "colina", texto: "@@world.zonas.llano.salidas.1.texto" },
      ],
      lugares: ["descanso", "forrajear"],
      materialForajeo: ["colmillo_jabali", "cuerno_toro"],
      eventos: [
        "@@world.zonas.llano.eventos.0",
        "@@world.zonas.llano.eventos.1",
        "@@world.zonas.llano.eventos.2",
        "@@world.zonas.llano.eventos.3",
      ],
    },

    colina: {
      id: "colina", bioma: "colinas", encuentro: 0.65, nivelMax: 9,
      nombre: "@@world.zonas.colina.nombre",
      descripcion: [
        "@@world.zonas.colina.descripcion.0",
        "@@world.zonas.colina.descripcion.1",
        "@@world.zonas.colina.descripcion.2",
      ],
      salidas: [
        { a: "llano", texto: "@@world.zonas.colina.salidas.0.texto" },
        { a: "paso_norte", texto: "@@world.zonas.colina.salidas.1.texto" },
      ],
      lugares: ["descanso", "forrajear"],
      materialForajeo: ["fragmento_coloso", "zarpa_osa"],
      eventos: [
        "@@world.zonas.colina.eventos.0",
        "@@world.zonas.colina.eventos.1",
        "@@world.zonas.colina.eventos.2",
        "@@world.zonas.colina.eventos.3",
      ],
    },

    paso_norte: {
      id: "paso_norte", bioma: "montana", encuentro: 0.7, nivelMax: 12,
      nombre: "@@world.zonas.paso_norte.nombre",
      descripcion: [
        "@@world.zonas.paso_norte.descripcion.0",
        "@@world.zonas.paso_norte.descripcion.1",
        "@@world.zonas.paso_norte.descripcion.2",
      ],
      salidas: [
        { a: "colina", texto: "@@world.zonas.paso_norte.salidas.0.texto" },
        { a: "confluencia", texto: "@@world.zonas.paso_norte.salidas.1.texto" },
      ],
      lugares: ["descanso", "forrajear"],
      materialForajeo: ["escarcha_gigante", "garra_puma"],
      eventos: [
        "@@world.zonas.paso_norte.eventos.0",
        "@@world.zonas.paso_norte.eventos.1",
        "@@world.zonas.paso_norte.eventos.2",
        "@@world.zonas.paso_norte.eventos.3",
        "@@world.zonas.paso_norte.eventos.4",
      ],
    },

    confluencia: {
      id: "confluencia", bioma: null, encuentro: 0,
      nombre: "@@world.zonas.confluencia.nombre",
      descripcion: [
        "@@world.zonas.confluencia.descripcion.0",
        "@@world.zonas.confluencia.descripcion.1",
        "@@world.zonas.confluencia.descripcion.2",
      ],
      salidas: [
        { a: "paso_norte", texto: "@@world.zonas.confluencia.salidas.0.texto" },
        { a: "catacumba", texto: "@@world.zonas.confluencia.salidas.1.texto" },
      ],
      lugares: ["escuela_blanca", "escuela_gris", "descanso"],
    },

    catacumba: {
      id: "catacumba", bioma: null, encuentro: 0,
      nombre: "@@world.zonas.catacumba.nombre",
      descripcion: [
        "@@world.zonas.catacumba.descripcion.0",
        "@@world.zonas.catacumba.descripcion.1",
        "@@world.zonas.catacumba.descripcion.2",
      ],
      salidas: [
        { a: "confluencia", texto: "@@world.zonas.catacumba.salidas.0.texto" },
      ],
      lugares: ["escuela_negra", "descanso"],
    },
  },
};
