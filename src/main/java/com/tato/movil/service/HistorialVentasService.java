package com.tato.movil.service;

import com.tato.movil.domain.HistorialVentas;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link HistorialVentas}.
 */
public interface HistorialVentasService {
    /**
     * Save a historialVentas.
     *
     * @param historialVentas the entity to save.
     * @return the persisted entity.
     */
    HistorialVentas save(HistorialVentas historialVentas);

    /**
     * Updates a historialVentas.
     *
     * @param historialVentas the entity to update.
     * @return the persisted entity.
     */
    HistorialVentas update(HistorialVentas historialVentas);

    /**
     * Partially updates a historialVentas.
     *
     * @param historialVentas the entity to update partially.
     * @return the persisted entity.
     */
    Optional<HistorialVentas> partialUpdate(HistorialVentas historialVentas);

    /**
     * Get all the historialVentas.
     *
     * @return the list of entities.
     */
    List<HistorialVentas> findAll();

    /**
     * Get the "id" historialVentas.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<HistorialVentas> findOne(Long id);

    /**
     * Delete the "id" historialVentas.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
