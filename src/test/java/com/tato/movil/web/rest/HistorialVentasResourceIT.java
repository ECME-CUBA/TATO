package com.tato.movil.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.tato.movil.IntegrationTest;
import com.tato.movil.domain.HistorialVentas;
import com.tato.movil.repository.HistorialVentasRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
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
 * Integration tests for the {@link HistorialVentasResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class HistorialVentasResourceIT {

    private static final Instant DEFAULT_FECHA_VENTA = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_FECHA_VENTA = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Float DEFAULT_COMISION_MENSAJERIA = 1F;
    private static final Float UPDATED_COMISION_MENSAJERIA = 2F;

    private static final String ENTITY_API_URL = "/api/historial-ventas";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private HistorialVentasRepository historialVentasRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restHistorialVentasMockMvc;

    private HistorialVentas historialVentas;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistorialVentas createEntity(EntityManager em) {
        HistorialVentas historialVentas = new HistorialVentas()
            .fechaVenta(DEFAULT_FECHA_VENTA)
            .comisionMensajeria(DEFAULT_COMISION_MENSAJERIA);
        return historialVentas;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static HistorialVentas createUpdatedEntity(EntityManager em) {
        HistorialVentas historialVentas = new HistorialVentas()
            .fechaVenta(UPDATED_FECHA_VENTA)
            .comisionMensajeria(UPDATED_COMISION_MENSAJERIA);
        return historialVentas;
    }

    @BeforeEach
    public void initTest() {
        historialVentas = createEntity(em);
    }

    @Test
    @Transactional
    void createHistorialVentas() throws Exception {
        int databaseSizeBeforeCreate = historialVentasRepository.findAll().size();
        // Create the HistorialVentas
        restHistorialVentasMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isCreated());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeCreate + 1);
        HistorialVentas testHistorialVentas = historialVentasList.get(historialVentasList.size() - 1);
        assertThat(testHistorialVentas.getFechaVenta()).isEqualTo(DEFAULT_FECHA_VENTA);
        assertThat(testHistorialVentas.getComisionMensajeria()).isEqualTo(DEFAULT_COMISION_MENSAJERIA);
    }

    @Test
    @Transactional
    void createHistorialVentasWithExistingId() throws Exception {
        // Create the HistorialVentas with an existing ID
        historialVentas.setId(1L);

        int databaseSizeBeforeCreate = historialVentasRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restHistorialVentasMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllHistorialVentas() throws Exception {
        // Initialize the database
        historialVentasRepository.saveAndFlush(historialVentas);

        // Get all the historialVentasList
        restHistorialVentasMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(historialVentas.getId().intValue())))
            .andExpect(jsonPath("$.[*].fechaVenta").value(hasItem(DEFAULT_FECHA_VENTA.toString())))
            .andExpect(jsonPath("$.[*].comisionMensajeria").value(hasItem(DEFAULT_COMISION_MENSAJERIA.doubleValue())));
    }

    @Test
    @Transactional
    void getHistorialVentas() throws Exception {
        // Initialize the database
        historialVentasRepository.saveAndFlush(historialVentas);

        // Get the historialVentas
        restHistorialVentasMockMvc
            .perform(get(ENTITY_API_URL_ID, historialVentas.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(historialVentas.getId().intValue()))
            .andExpect(jsonPath("$.fechaVenta").value(DEFAULT_FECHA_VENTA.toString()))
            .andExpect(jsonPath("$.comisionMensajeria").value(DEFAULT_COMISION_MENSAJERIA.doubleValue()));
    }

    @Test
    @Transactional
    void getNonExistingHistorialVentas() throws Exception {
        // Get the historialVentas
        restHistorialVentasMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewHistorialVentas() throws Exception {
        // Initialize the database
        historialVentasRepository.saveAndFlush(historialVentas);

        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();

        // Update the historialVentas
        HistorialVentas updatedHistorialVentas = historialVentasRepository.findById(historialVentas.getId()).get();
        // Disconnect from session so that the updates on updatedHistorialVentas are not directly saved in db
        em.detach(updatedHistorialVentas);
        updatedHistorialVentas.fechaVenta(UPDATED_FECHA_VENTA).comisionMensajeria(UPDATED_COMISION_MENSAJERIA);

        restHistorialVentasMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedHistorialVentas.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedHistorialVentas))
            )
            .andExpect(status().isOk());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
        HistorialVentas testHistorialVentas = historialVentasList.get(historialVentasList.size() - 1);
        assertThat(testHistorialVentas.getFechaVenta()).isEqualTo(UPDATED_FECHA_VENTA);
        assertThat(testHistorialVentas.getComisionMensajeria()).isEqualTo(UPDATED_COMISION_MENSAJERIA);
    }

    @Test
    @Transactional
    void putNonExistingHistorialVentas() throws Exception {
        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();
        historialVentas.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistorialVentasMockMvc
            .perform(
                put(ENTITY_API_URL_ID, historialVentas.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchHistorialVentas() throws Exception {
        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();
        historialVentas.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistorialVentasMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamHistorialVentas() throws Exception {
        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();
        historialVentas.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistorialVentasMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateHistorialVentasWithPatch() throws Exception {
        // Initialize the database
        historialVentasRepository.saveAndFlush(historialVentas);

        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();

        // Update the historialVentas using partial update
        HistorialVentas partialUpdatedHistorialVentas = new HistorialVentas();
        partialUpdatedHistorialVentas.setId(historialVentas.getId());

        partialUpdatedHistorialVentas.comisionMensajeria(UPDATED_COMISION_MENSAJERIA);

        restHistorialVentasMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistorialVentas.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistorialVentas))
            )
            .andExpect(status().isOk());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
        HistorialVentas testHistorialVentas = historialVentasList.get(historialVentasList.size() - 1);
        assertThat(testHistorialVentas.getFechaVenta()).isEqualTo(DEFAULT_FECHA_VENTA);
        assertThat(testHistorialVentas.getComisionMensajeria()).isEqualTo(UPDATED_COMISION_MENSAJERIA);
    }

    @Test
    @Transactional
    void fullUpdateHistorialVentasWithPatch() throws Exception {
        // Initialize the database
        historialVentasRepository.saveAndFlush(historialVentas);

        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();

        // Update the historialVentas using partial update
        HistorialVentas partialUpdatedHistorialVentas = new HistorialVentas();
        partialUpdatedHistorialVentas.setId(historialVentas.getId());

        partialUpdatedHistorialVentas.fechaVenta(UPDATED_FECHA_VENTA).comisionMensajeria(UPDATED_COMISION_MENSAJERIA);

        restHistorialVentasMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedHistorialVentas.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedHistorialVentas))
            )
            .andExpect(status().isOk());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
        HistorialVentas testHistorialVentas = historialVentasList.get(historialVentasList.size() - 1);
        assertThat(testHistorialVentas.getFechaVenta()).isEqualTo(UPDATED_FECHA_VENTA);
        assertThat(testHistorialVentas.getComisionMensajeria()).isEqualTo(UPDATED_COMISION_MENSAJERIA);
    }

    @Test
    @Transactional
    void patchNonExistingHistorialVentas() throws Exception {
        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();
        historialVentas.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restHistorialVentasMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, historialVentas.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchHistorialVentas() throws Exception {
        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();
        historialVentas.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistorialVentasMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isBadRequest());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamHistorialVentas() throws Exception {
        int databaseSizeBeforeUpdate = historialVentasRepository.findAll().size();
        historialVentas.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restHistorialVentasMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(historialVentas))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the HistorialVentas in the database
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteHistorialVentas() throws Exception {
        // Initialize the database
        historialVentasRepository.saveAndFlush(historialVentas);

        int databaseSizeBeforeDelete = historialVentasRepository.findAll().size();

        // Delete the historialVentas
        restHistorialVentasMockMvc
            .perform(delete(ENTITY_API_URL_ID, historialVentas.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<HistorialVentas> historialVentasList = historialVentasRepository.findAll();
        assertThat(historialVentasList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
