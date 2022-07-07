package com.tato.movil.repository;

import com.tato.movil.domain.HistorialVentas;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data SQL repository for the HistorialVentas entity.
 */
@SuppressWarnings("unused")
@Repository
public interface HistorialVentasRepository extends JpaRepository<HistorialVentas, Long> {}
