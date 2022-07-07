package com.tato.movil.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.tato.movil.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class ArticuloTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(Articulo.class);
        Articulo articulo1 = new Articulo();
        articulo1.setId(1L);
        Articulo articulo2 = new Articulo();
        articulo2.setId(articulo1.getId());
        assertThat(articulo1).isEqualTo(articulo2);
        articulo2.setId(2L);
        assertThat(articulo1).isNotEqualTo(articulo2);
        articulo1.setId(null);
        assertThat(articulo1).isNotEqualTo(articulo2);
    }
}
