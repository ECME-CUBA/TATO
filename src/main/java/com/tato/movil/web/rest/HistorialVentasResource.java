package com.tato.movil.web.rest;

import com.tato.movil.domain.HistorialVentas;
import com.tato.movil.repository.HistorialVentasRepository;
import com.tato.movil.service.HistorialVentasService;
import com.tato.movil.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.tato.movil.domain.HistorialVentas}.
 */
@RestController
@RequestMapping("/api")
public class HistorialVentasResource {

    private final Logger log = LoggerFactory.getLogger(HistorialVentasResource.class);

    private static final String ENTITY_NAME = "historialVentas";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final HistorialVentasService historialVentasService;

    private final HistorialVentasRepository historialVentasRepository;

    public HistorialVentasResource(HistorialVentasService historialVentasService, HistorialVentasRepository historialVentasRepository) {
        this.historialVentasService = historialVentasService;
        this.historialVentasRepository = historialVentasRepository;
    }

    /**
     * {@code POST  /historial-ventas} : Create a new historialVentas.
     *
     * @param historialVentas the historialVentas to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new historialVentas, or with status {@code 400 (Bad Request)} if the historialVentas has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/historial-ventas")
    public ResponseEntity<HistorialVentas> createHistorialVentas(@RequestBody HistorialVentas historialVentas) throws URISyntaxException {
        log.debug("REST request to save HistorialVentas : {}", historialVentas);
        if (historialVentas.getId() != null) {
            throw new BadRequestAlertException("A new historialVentas cannot already have an ID", ENTITY_NAME, "idexists");
        }
        HistorialVentas result = historialVentasService.save(historialVentas);
        return ResponseEntity
            .created(new URI("/api/historial-ventas/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, false, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /historial-ventas/:id} : Updates an existing historialVentas.
     *
     * @param id the id of the historialVentas to save.
     * @param historialVentas the historialVentas to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historialVentas,
     * or with status {@code 400 (Bad Request)} if the historialVentas is not valid,
     * or with status {@code 500 (Internal Server Error)} if the historialVentas couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/historial-ventas/{id}")
    public ResponseEntity<HistorialVentas> updateHistorialVentas(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HistorialVentas historialVentas
    ) throws URISyntaxException {
        log.debug("REST request to update HistorialVentas : {}, {}", id, historialVentas);
        if (historialVentas.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historialVentas.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historialVentasRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        HistorialVentas result = historialVentasService.update(historialVentas);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, historialVentas.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /historial-ventas/:id} : Partial updates given fields of an existing historialVentas, field will ignore if it is null
     *
     * @param id the id of the historialVentas to save.
     * @param historialVentas the historialVentas to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated historialVentas,
     * or with status {@code 400 (Bad Request)} if the historialVentas is not valid,
     * or with status {@code 404 (Not Found)} if the historialVentas is not found,
     * or with status {@code 500 (Internal Server Error)} if the historialVentas couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/historial-ventas/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<HistorialVentas> partialUpdateHistorialVentas(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody HistorialVentas historialVentas
    ) throws URISyntaxException {
        log.debug("REST request to partial update HistorialVentas partially : {}, {}", id, historialVentas);
        if (historialVentas.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, historialVentas.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!historialVentasRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<HistorialVentas> result = historialVentasService.partialUpdate(historialVentas);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, false, ENTITY_NAME, historialVentas.getId().toString())
        );
    }

    /**
     * {@code GET  /historial-ventas} : get all the historialVentas.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of historialVentas in body.
     */
    @GetMapping("/historial-ventas")
    public List<HistorialVentas> getAllHistorialVentas() {
        log.debug("REST request to get all HistorialVentas");
        return historialVentasService.findAll();
    }

    /**
     * {@code GET  /historial-ventas/:id} : get the "id" historialVentas.
     *
     * @param id the id of the historialVentas to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the historialVentas, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/historial-ventas/{id}")
    public ResponseEntity<HistorialVentas> getHistorialVentas(@PathVariable Long id) {
        log.debug("REST request to get HistorialVentas : {}", id);
        Optional<HistorialVentas> historialVentas = historialVentasService.findOne(id);
        return ResponseUtil.wrapOrNotFound(historialVentas);
    }

    /**
     * {@code DELETE  /historial-ventas/:id} : delete the "id" historialVentas.
     *
     * @param id the id of the historialVentas to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/historial-ventas/{id}")
    public ResponseEntity<Void> deleteHistorialVentas(@PathVariable Long id) {
        log.debug("REST request to delete HistorialVentas : {}", id);
        historialVentasService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, false, ENTITY_NAME, id.toString()))
            .build();
    }
}
