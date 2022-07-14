package com.tato.movil.service.impl;

import com.tato.movil.domain.HistorialVentas;
import com.tato.movil.repository.HistorialVentasRepository;
import com.tato.movil.service.HistorialVentasService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link HistorialVentas}.
 */
@Service
@Transactional
public class HistorialVentasServiceImpl implements HistorialVentasService {

    private final Logger log = LoggerFactory.getLogger(HistorialVentasServiceImpl.class);

    private final HistorialVentasRepository historialVentasRepository;

    public HistorialVentasServiceImpl(HistorialVentasRepository historialVentasRepository) {
        this.historialVentasRepository = historialVentasRepository;
    }

    @Override
    public HistorialVentas save(HistorialVentas historialVentas) {
        log.debug("Request to save HistorialVentas : {}", historialVentas);
        return historialVentasRepository.save(historialVentas);
    }

    @Override
    public HistorialVentas update(HistorialVentas historialVentas) {
        log.debug("Request to save HistorialVentas : {}", historialVentas);
        return historialVentasRepository.save(historialVentas);
    }

    @Override
    public Optional<HistorialVentas> partialUpdate(HistorialVentas historialVentas) {
        log.debug("Request to partially update HistorialVentas : {}", historialVentas);

        return historialVentasRepository
            .findById(historialVentas.getId())
            .map(existingHistorialVentas -> {
                if (historialVentas.getFechaVenta() != null) {
                    existingHistorialVentas.setFechaVenta(historialVentas.getFechaVenta());
                }
                if (historialVentas.getComisionMensajeria() != null) {
                    existingHistorialVentas.setComisionMensajeria(historialVentas.getComisionMensajeria());
                }
                if (historialVentas.getCantidad() != null) {
                    existingHistorialVentas.setCantidad(historialVentas.getCantidad());
                }

                return existingHistorialVentas;
            })
            .map(historialVentasRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<HistorialVentas> findAll() {
        log.debug("Request to get all HistorialVentas");
        return historialVentasRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<HistorialVentas> findOne(Long id) {
        log.debug("Request to get HistorialVentas : {}", id);
        return historialVentasRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete HistorialVentas : {}", id);
        historialVentasRepository.deleteById(id);
    }
}
