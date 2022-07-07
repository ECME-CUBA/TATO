package com.tato.movil.service;

import com.tato.movil.domain.Articulo;
import java.util.Optional;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

/**
 * Service Interface for managing {@link Articulo}.
 */
public interface ArticuloService {
    /**
     * Save a articulo.
     *
     * @param articulo the entity to save.
     * @return the persisted entity.
     */
    Articulo save(Articulo articulo);

    /**
     * Updates a articulo.
     *
     * @param articulo the entity to update.
     * @return the persisted entity.
     */
    Articulo update(Articulo articulo);

    /**
     * Partially updates a articulo.
     *
     * @param articulo the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Articulo> partialUpdate(Articulo articulo);

    /**
     * Get all the articulos.
     *
     * @param pageable the pagination information.
     * @return the list of entities.
     */
    Page<Articulo> findAll(Pageable pageable);

    /**
     * Get the "id" articulo.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Articulo> findOne(Long id);

    /**
     * Delete the "id" articulo.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
