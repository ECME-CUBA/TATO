package com.tato.movil.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tato.movil.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class HistorialVentasTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(HistorialVentas.class);
        HistorialVentas historialVentas1 = new HistorialVentas();
        historialVentas1.setId(1L);
        HistorialVentas historialVentas2 = new HistorialVentas();
        historialVentas2.setId(historialVentas1.getId());
        assertThat(historialVentas1).isEqualTo(historialVentas2);
        historialVentas2.setId(2L);
        assertThat(historialVentas1).isNotEqualTo(historialVentas2);
        historialVentas1.setId(null);
        assertThat(historialVentas1).isNotEqualTo(historialVentas2);
    }
}
