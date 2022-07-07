package com.tato.movil.service.impl;

import com.tato.movil.domain.Articulo;
import com.tato.movil.repository.ArticuloRepository;
import com.tato.movil.service.ArticuloService;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Articulo}.
 */
@Service
@Transactional
public class ArticuloServiceImpl implements ArticuloService {

    private final Logger log = LoggerFactory.getLogger(ArticuloServiceImpl.class);

    private final ArticuloRepository articuloRepository;

    public ArticuloServiceImpl(ArticuloRepository articuloRepository) {
        this.articuloRepository = articuloRepository;
    }

    @Override
    public Articulo save(Articulo articulo) {
        log.debug("Request to save Articulo : {}", articulo);
        return articuloRepository.save(articulo);
    }

    @Override
    public Articulo update(Articulo articulo) {
        log.debug("Request to save Articulo : {}", articulo);
        return articuloRepository.save(articulo);
    }

    @Override
    public Optional<Articulo> partialUpdate(Articulo articulo) {
        log.debug("Request to partially update Articulo : {}", articulo);

        return articuloRepository
            .findById(articulo.getId())
            .map(existingArticulo -> {
                if (articulo.getNombre() != null) {
                    existingArticulo.setNombre(articulo.getNombre());
                }
                if (articulo.getMarca() != null) {
                    existingArticulo.setMarca(articulo.getMarca());
                }
                if (articulo.getPrecio() != null) {
                    existingArticulo.setPrecio(articulo.getPrecio());
                }
                if (articulo.getCantidad() != null) {
                    existingArticulo.setCantidad(articulo.getCantidad());
                }
                if (articulo.getCosto() != null) {
                    existingArticulo.setCosto(articulo.getCosto());
                }

                return existingArticulo;
            })
            .map(articuloRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<Articulo> findAll(Pageable pageable) {
        log.debug("Request to get all Articulos");
        return articuloRepository.findAll(pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Articulo> findOne(Long id) {
        log.debug("Request to get Articulo : {}", id);
        return articuloRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Articulo : {}", id);
        articuloRepository.deleteById(id);
    }
}
