package com.tato.movil.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tato.movil.IntegrationTest;
import com.tato.movil.domain.Articulo;
import com.tato.movil.repository.ArticuloRepository;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link ArticuloResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class ArticuloResourceIT {

    private static final String DEFAULT_NOMBRE = "AAAAAAAAAA";
    private static final String UPDATED_NOMBRE = "BBBBBBBBBB";

    private static final String DEFAULT_MARCA = "AAAAAAAAAA";
    private static final String UPDATED_MARCA = "BBBBBBBBBB";

    private static final Float DEFAULT_PRECIO = 1F;
    private static final Float UPDATED_PRECIO = 2F;

    private static final Integer DEFAULT_CANTIDAD = 1;
    private static final Integer UPDATED_CANTIDAD = 2;

    private static final Float DEFAULT_COSTO = 1F;
    private static final Float UPDATED_COSTO = 2F;

    private static final String ENTITY_API_URL = "/api/articulos";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private ArticuloRepository articuloRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restArticuloMockMvc;

    private Articulo articulo;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Articulo createEntity(EntityManager em) {
        Articulo articulo = new Articulo()
            .nombre(DEFAULT_NOMBRE)
            .marca(DEFAULT_MARCA)
            .precio(DEFAULT_PRECIO)
            .cantidad(DEFAULT_CANTIDAD)
            .costo(DEFAULT_COSTO);
        return articulo;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Articulo createUpdatedEntity(EntityManager em) {
        Articulo articulo = new Articulo()
            .nombre(UPDATED_NOMBRE)
            .marca(UPDATED_MARCA)
            .precio(UPDATED_PRECIO)
            .cantidad(UPDATED_CANTIDAD)
            .costo(UPDATED_COSTO);
        return articulo;
    }

    @BeforeEach
    public void initTest() {
        articulo = createEntity(em);
    }

    @Test
    @Transactional
    void createArticulo() throws Exception {
        int databaseSizeBeforeCreate = articuloRepository.findAll().size();
        // Create the Articulo
        restArticuloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(articulo)))
            .andExpect(status().isCreated());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeCreate + 1);
        Articulo testArticulo = articuloList.get(articuloList.size() - 1);
        assertThat(testArticulo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testArticulo.getMarca()).isEqualTo(DEFAULT_MARCA);
        assertThat(testArticulo.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testArticulo.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
        assertThat(testArticulo.getCosto()).isEqualTo(DEFAULT_COSTO);
    }

    @Test
    @Transactional
    void createArticuloWithExistingId() throws Exception {
        // Create the Articulo with an existing ID
        articulo.setId(1L);

        int databaseSizeBeforeCreate = articuloRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restArticuloMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(articulo)))
            .andExpect(status().isBadRequest());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllArticulos() throws Exception {
        // Initialize the database
        articuloRepository.saveAndFlush(articulo);

        // Get all the articuloList
        restArticuloMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(articulo.getId().intValue())))
            .andExpect(jsonPath("$.[*].nombre").value(hasItem(DEFAULT_NOMBRE)))
            .andExpect(jsonPath("$.[*].marca").value(hasItem(DEFAULT_MARCA)))
            .andExpect(jsonPath("$.[*].precio").value(hasItem(DEFAULT_PRECIO.doubleValue())))
            .andExpect(jsonPath("$.[*].cantidad").value(hasItem(DEFAULT_CANTIDAD)))
            .andExpect(jsonPath("$.[*].costo").value(hasItem(DEFAULT_COSTO.doubleValue())));
    }

    @Test
    @Transactional
    void getArticulo() throws Exception {
        // Initialize the database
        articuloRepository.saveAndFlush(articulo);

        // Get the articulo
        restArticuloMockMvc
            .perform(get(ENTITY_API_URL_ID, articulo.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(articulo.getId().intValue()))
            .andExpect(jsonPath("$.nombre").value(DEFAULT_NOMBRE))
            .andExpect(jsonPath("$.marca").value(DEFAULT_MARCA))
            .andExpect(jsonPath("$.precio").value(DEFAULT_PRECIO.doubleValue()))
            .andExpect(jsonPath("$.cantidad").value(DEFAULT_CANTIDAD))
            .andExpect(jsonPath("$.costo").value(DEFAULT_COSTO.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingArticulo() throws Exception {
        // Get the articulo
        restArticuloMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewArticulo() throws Exception {
        // Initialize the database
        articuloRepository.saveAndFlush(articulo);

        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();

        // Update the articulo
        Articulo updatedArticulo = articuloRepository.findById(articulo.getId()).get();
        // Disconnect from session so that the updates on updatedArticulo are not directly saved in db
        em.detach(updatedArticulo);
        updatedArticulo.nombre(UPDATED_NOMBRE).marca(UPDATED_MARCA).precio(UPDATED_PRECIO).cantidad(UPDATED_CANTIDAD).costo(UPDATED_COSTO);

        restArticuloMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedArticulo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedArticulo))
            )
            .andExpect(status().isOk());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
        Articulo testArticulo = articuloList.get(articuloList.size() - 1);
        assertThat(testArticulo.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testArticulo.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testArticulo.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testArticulo.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
        assertThat(testArticulo.getCosto()).isEqualTo(UPDATED_COSTO);
    }

    @Test
    @Transactional
    void putNonExistingArticulo() throws Exception {
        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();
        articulo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArticuloMockMvc
            .perform(
                put(ENTITY_API_URL_ID, articulo.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(articulo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchArticulo() throws Exception {
        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();
        articulo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArticuloMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(articulo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamArticulo() throws Exception {
        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();
        articulo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArticuloMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(articulo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateArticuloWithPatch() throws Exception {
        // Initialize the database
        articuloRepository.saveAndFlush(articulo);

        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();

        // Update the articulo using partial update
        Articulo partialUpdatedArticulo = new Articulo();
        partialUpdatedArticulo.setId(articulo.getId());

        partialUpdatedArticulo.marca(UPDATED_MARCA);

        restArticuloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArticulo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArticulo))
            )
            .andExpect(status().isOk());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
        Articulo testArticulo = articuloList.get(articuloList.size() - 1);
        assertThat(testArticulo.getNombre()).isEqualTo(DEFAULT_NOMBRE);
        assertThat(testArticulo.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testArticulo.getPrecio()).isEqualTo(DEFAULT_PRECIO);
        assertThat(testArticulo.getCantidad()).isEqualTo(DEFAULT_CANTIDAD);
        assertThat(testArticulo.getCosto()).isEqualTo(DEFAULT_COSTO);
    }

    @Test
    @Transactional
    void fullUpdateArticuloWithPatch() throws Exception {
        // Initialize the database
        articuloRepository.saveAndFlush(articulo);

        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();

        // Update the articulo using partial update
        Articulo partialUpdatedArticulo = new Articulo();
        partialUpdatedArticulo.setId(articulo.getId());

        partialUpdatedArticulo
            .nombre(UPDATED_NOMBRE)
            .marca(UPDATED_MARCA)
            .precio(UPDATED_PRECIO)
            .cantidad(UPDATED_CANTIDAD)
            .costo(UPDATED_COSTO);

        restArticuloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedArticulo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedArticulo))
            )
            .andExpect(status().isOk());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
        Articulo testArticulo = articuloList.get(articuloList.size() - 1);
        assertThat(testArticulo.getNombre()).isEqualTo(UPDATED_NOMBRE);
        assertThat(testArticulo.getMarca()).isEqualTo(UPDATED_MARCA);
        assertThat(testArticulo.getPrecio()).isEqualTo(UPDATED_PRECIO);
        assertThat(testArticulo.getCantidad()).isEqualTo(UPDATED_CANTIDAD);
        assertThat(testArticulo.getCosto()).isEqualTo(UPDATED_COSTO);
    }

    @Test
    @Transactional
    void patchNonExistingArticulo() throws Exception {
        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();
        articulo.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restArticuloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, articulo.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(articulo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchArticulo() throws Exception {
        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();
        articulo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArticuloMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(articulo))
            )
            .andExpect(status().isBadRequest());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamArticulo() throws Exception {
        int databaseSizeBeforeUpdate = articuloRepository.findAll().size();
        articulo.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restArticuloMockMvc
            .perform(patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(articulo)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Articulo in the database
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteArticulo() throws Exception {
        // Initialize the database
        articuloRepository.saveAndFlush(articulo);

        int databaseSizeBeforeDelete = articuloRepository.findAll().size();

        // Delete the articulo
        restArticuloMockMvc
            .perform(delete(ENTITY_API_URL_ID, articulo.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Articulo> articuloList = articuloRepository.findAll();
        assertThat(articuloList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
