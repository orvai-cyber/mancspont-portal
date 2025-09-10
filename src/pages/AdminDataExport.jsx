
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import * as AllEntities from '@/api/entities'; // Import all entities dynamically
import { 
  Download, 
  Database, 
  FileText,
  CheckCircle,
  AlertCircle,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

// Central configuration for entities, including their display names (labels).
// This is the only place to update when a new entity is added or removed.
const ENTITY_CONFIG = {
  Animal: { label: 'Állatok' },
  Shelter: { label: 'Menhelyek' },
  Event: { label: 'Események' },
  Post: { label: 'Közösségi posztok' },
  Article: { label: 'Blog cikkek' },
  Product: { label: 'Termékek' },
  AdoptionRequest: { label: 'Örökbefogadási kérelmek' },
  Conversation: { label: 'Beszélgetések' },
  Message: { label: 'Üzenetek' },
  Donation: { label: 'Adományok' },
  EventRegistration: { label: 'Esemény regisztrációk' },
  Favorite: { label: 'Kedvencek' },
  ServiceProvider: { label: 'Szolgáltatók' },
  User: { label: 'Felhasználók' }
};

export default function AdminDataExport() {
  const [isExporting, setIsExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState(0);
  const [exportStatus, setExportStatus] = useState({});
  const [exportResults, setExportResults] = useState(null);
  const [availableEntities, setAvailableEntities] = useState([]);

  useEffect(() => {
    // Dynamically build the list of entities available for export
    const entities = Object.keys(AllEntities)
      .filter(key => AllEntities[key] && typeof AllEntities[key].list === 'function' && ENTITY_CONFIG[key])
      .map(key => ({
        name: key,
        entity: AllEntities[key],
        label: ENTITY_CONFIG[key].label,
      }))
      .sort((a, b) => a.label.localeCompare(b.label, 'hu')); // Sort alphabetically by label

    setAvailableEntities(entities);
  }, []);

  const downloadJSON = (data, filename) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const exportSingleEntity = async (entityName, entityClass) => {
    try {
      setExportStatus(prev => ({ ...prev, [entityName]: 'loading' }));
      const data = await entityClass.list();
      setExportStatus(prev => ({ ...prev, [entityName]: 'success' }));
      return { [entityName]: data || [] };
    } catch (error) {
      console.error(`Hiba a ${entityName} exportálásakor:`, error);
      setExportStatus(prev => ({ ...prev, [entityName]: 'error' }));
      toast.error(`Hiba a(z) ${entityName} entitás exportálásakor.`);
      return { [entityName]: [] };
    }
  };

  const exportAllData = async () => {
    setIsExporting(true);
    setExportProgress(0);
    setExportStatus({});
    
    try {
      const allData = {
        export_info: {
          timestamp: new Date().toISOString(),
          exported_by: 'Admin Panel',
          platform: 'MancsPont.hu'
        }
      };

      for (let i = 0; i < availableEntities.length; i++) {
        const entity = availableEntities[i];
        const entityData = await exportSingleEntity(entity.name, entity.entity);
        Object.assign(allData, entityData);
        setExportProgress(((i + 1) / availableEntities.length) * 100);
      }

      setExportResults(allData);
      
      const timestamp = new Date().toISOString().split('T')[0];
      downloadJSON(allData, `mancspoint_teljes_export_${timestamp}.json`);
      
      toast.success('Adatexport sikeresen befejeződött!');
      
    } catch (error) {
      console.error('Hiba az export során:', error);
      toast.error('Hiba történt az export során');
    } finally {
      setIsExporting(false);
    }
  };

  const exportSelectedEntity = async (entityName, entityClass, label) => {
    try {
      toast.info(`${label} exportálása folyamatban...`);
      const data = await entityClass.list();
      const timestamp = new Date().toISOString().split('T')[0];
      
      const exportData = {
        export_info: {
          timestamp: new Date().toISOString(),
          entity: entityName,
          exported_by: 'Admin Panel'
        },
        [entityName]: data || []
      };

      downloadJSON(exportData, `${entityName.toLowerCase()}_${timestamp}.json`);
      toast.success(`${label} sikeresen exportálva!`);
      
    } catch (error) {
      console.error(`Hiba a ${entityName} exportálásakor:`, error);
      toast.error(`Hiba történt a ${label} exportálásakor`);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'loading': return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Adatok exportálása</h1>
            <p className="text-gray-600">Töltsd le az adatbázis tartalmát JSON formátumban</p>
          </div>
          <Badge className="bg-blue-100 text-blue-800">
            <Database className="w-4 h-4 mr-2" />
            Adatkezelés
          </Badge>
        </div>

        {/* Teljes export */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Teljes adatbázis export
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-gray-600">
              Ez exportálja az összes entitás adatait egy nagy JSON fájlba. 
              A folyamat néhány percet is igénybe vehet.
            </p>
            
            {isExporting && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Export folyamatban...</span>
                  <span>{Math.round(exportProgress)}%</span>
                </div>
                <Progress value={exportProgress} className="w-full" />
              </div>
            )}

            <Button
              onClick={exportAllData}
              disabled={isExporting || availableEntities.length === 0}
              className="w-full"
              size="lg"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Export folyamatban...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5 mr-2" />
                  Teljes export indítása
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        <Separator />

        {/* Egyedi entitások exportálása */}
        <Card>
          <CardHeader>
            <CardTitle>Egyedi entitások exportálása</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableEntities.map((entity) => (
                <Card key={entity.name} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-medium">{entity.label}</h3>
                      {exportStatus[entity.name] && getStatusIcon(exportStatus[entity.name])}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => exportSelectedEntity(entity.name, entity.entity, entity.label)}
                      className="w-full"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Export eredmények */}
        {exportResults && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Utolsó export eredménye
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Export időpontja: {new Date(exportResults.export_info.timestamp).toLocaleString('hu-HU')}
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-sm">
                  {Object.entries(exportResults)
                    .filter(([key]) => key !== 'export_info')
                    .map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium">{key}:</span>
                        <span>{Array.isArray(value) ? value.length : 0} elem</span>
                      </div>
                    ))}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const timestamp = new Date().toISOString().split('T')[0];
                    downloadJSON(exportResults, `mancspoint_redownload_${timestamp}.json`);
                  }}
                  className="mt-4"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Újraleöltés
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </AdminLayout>
  );
}
