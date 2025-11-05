import React, { useState, useEffect, useRef } from 'react';
import { Search, RefreshCw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../../../../shared/components/ui/card';
import { usePayments } from '../query/payments';
import { PaymentCard } from './PaymentCard';
import { CreatePaymentModal } from './CreatePaymentModal';
import { PaymentAbonoModal } from './PaymentAbonoModal';
import { EditPaymentModal } from './EditPaymentModal';
import type { Payment, PaymentFilters, PaymentStatus } from '../types/PaymentModel';

const ITEMS_PER_PAGE = 20;

export const PaymentManagement: React.FC = () => {
  const [filters, setFilters] = useState<PaymentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [tenantSearchTerm, setTenantSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAbonoModal, setShowAbonoModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [showStatusDropdown, setShowStatusDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { data: payments = [], isLoading, refetch } = usePayments(filters);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowStatusDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredPayments = payments.filter(payment => {
    const tenantName = `${payment.contrato.inquilino?.nombres || ''} ${payment.contrato.inquilino?.apellidos || ''}`.toLowerCase();
    const propertyAddress = payment.contrato.inmueble?.direccion.toLowerCase() || '';
    const generalSearch = searchTerm.toLowerCase();
    const tenantSearch = tenantSearchTerm.toLowerCase();

    const matchesGeneral = !searchTerm ? true : (
      tenantName.includes(generalSearch) ||
      propertyAddress.includes(generalSearch) ||
      payment.montoTotal.toString().includes(generalSearch) ||
      payment.estado.toLowerCase().includes(generalSearch)
    );

    const matchesTenant = !tenantSearchTerm ? true : tenantName.includes(tenantSearch);

    return matchesGeneral && matchesTenant;
  });

  // Reset to page 1 when filters or search change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, tenantSearchTerm, filters]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredPayments.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const paginatedPayments = filteredPayments.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

  const handleAbono = (payment: Payment) => {
    setSelectedPayment(payment);
    setShowAbonoModal(true);
  };

  const handleStatusFilter = (status: PaymentStatus | '') => {
    setFilters(prev => ({
      ...prev,
      estado: status || undefined
    }));
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="p-6 animate-pulse">
              <div className="space-y-4">
                <div className="h-4 bg-slate-200 rounded"></div>
                <div className="h-6 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded"></div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <Card className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por contrato, monto o estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Tenant Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Buscar por nombre del inquilino..."
                value={tenantSearchTerm}
                onChange={(e) => setTenantSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              />
            </div>
          </div>

          {/* Status Filter Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setShowStatusDropdown(!showStatusDropdown)}
              className="px-4 py-3 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors flex items-center gap-2 min-w-[140px]"
            >
              <span>
                {!filters.estado ? 'Todos los pagos' :
                 filters.estado === 'PENDIENTE' ? 'Pendientes' :
                 filters.estado === 'PARCIAL' ? 'Parciales' :
                 filters.estado === 'PAGADO' ? 'Pagados' :
                 filters.estado === 'VENCIDO' ? 'Vencidos' : 'Filtrar estado'}
              </span>
              <ChevronDown className="w-4 h-4" />
            </button>
            
            {showStatusDropdown && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-lg shadow-lg z-10 min-w-[140px]">
                <button
                  onClick={() => {
                    handleStatusFilter('');
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 first:rounded-t-lg ${
                    !filters.estado ? 'bg-blue-50 text-blue-700' : 'text-slate-700'
                  }`}
                >
                  Todos los pagos
                </button>
                <button
                  onClick={() => {
                    handleStatusFilter('PENDIENTE');
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                    filters.estado === 'PENDIENTE' ? 'bg-red-50 text-red-700' : 'text-slate-700'
                  }`}
                >
                  Pendientes
                </button>
                <button
                  onClick={() => {
                    handleStatusFilter('PARCIAL');
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                    filters.estado === 'PARCIAL' ? 'bg-yellow-50 text-yellow-700' : 'text-slate-700'
                  }`}
                >
                  Parciales
                </button>
                <button
                  onClick={() => {
                    handleStatusFilter('PAGADO');
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 ${
                    filters.estado === 'PAGADO' ? 'bg-green-50 text-green-700' : 'text-slate-700'
                  }`}
                >
                  Pagados
                </button>
                <button
                  onClick={() => {
                    handleStatusFilter('VENCIDO');
                    setShowStatusDropdown(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm hover:bg-slate-50 last:rounded-b-lg ${
                    filters.estado === 'VENCIDO' ? 'bg-red-50 text-red-800' : 'text-slate-700'
                  }`}
                >
                  Vencidos
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={() => refetch()}
              className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Card>

      {/* Results */}
      {filteredPayments.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="space-y-4">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto">
              <Search className="w-8 h-8 text-slate-400" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No se encontraron pagos
              </h3>
              <p className="text-slate-600">
                {searchTerm || tenantSearchTerm || filters.estado 
                  ? 'Intenta ajustar los filtros de búsqueda' 
                  : 'No hay pagos disponibles'}
              </p>
            </div>
          </div>
        </Card>
      ) : (
        <>
          {/* Pagination Info */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-600">
              Mostrando <span className="font-medium">{startIndex + 1}</span> a{' '}
              <span className="font-medium">{Math.min(endIndex, filteredPayments.length)}</span> de{' '}
              <span className="font-medium">{filteredPayments.length}</span> pagos
            </p>
          </div>

          {/* Payment Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paginatedPayments.map((payment) => (
              <PaymentCard
                key={payment.id}
                payment={payment}
                onAbono={handleAbono}
              />
            ))}
          </div>

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Card className="p-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-5 h-5" />
                  Anterior
                </button>

                <div className="flex items-center gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    const showPage = 
                      page === 1 || 
                      page === totalPages || 
                      (page >= currentPage - 1 && page <= currentPage + 1);
                    
                    const showEllipsis = 
                      (page === 2 && currentPage > 3) || 
                      (page === totalPages - 1 && currentPage < totalPages - 2);

                    if (showEllipsis) {
                      return <span key={page} className="px-2 text-slate-400">...</span>;
                    }

                    if (!showPage) return null;

                    return (
                      <button
                        key={page}
                        onClick={() => goToPage(page)}
                        className={`px-4 py-2 rounded-lg transition-colors ${
                          currentPage === page
                            ? 'bg-blue-500 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  onClick={() => goToPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Siguiente
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </Card>
          )}
        </>
      )}

      {/* Modals */}
      <CreatePaymentModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
      />

      <EditPaymentModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />

      <PaymentAbonoModal
        isOpen={showAbonoModal}
        onClose={() => {
          setShowAbonoModal(false);
          setSelectedPayment(null);
        }}
        payment={selectedPayment}
      />
    </div>
  );
};