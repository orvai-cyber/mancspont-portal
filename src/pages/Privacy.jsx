import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Lock, Eye, Database, UserCheck } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="bg-white">
      {/* Header */}
      <section className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
          <div className="inline-block p-4 bg-green-100 rounded-2xl mb-4">
            <Shield className="w-10 h-10 text-green-700" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Adatvédelmi Tájékoztató
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Hogyan kezeljük és védjük az Ön személyes adatait az ÁllatMenhely Portálon
          </p>
          <div className="mt-4 text-sm text-gray-500">
            Utoljára frissítve: 2024. január 15.
          </div>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="space-y-8">
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="w-5 h-5 text-green-600" />
                1. Az adatkezelő bemutatása
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-green-900 mb-2">Adatkezelő elérhetőségei:</h4>
                <div className="text-green-800 text-sm space-y-1">
                  <p><strong>Név:</strong> ÁllatMenhely Portál Kft.</p>
                  <p><strong>Cím:</strong> 1051 Budapest, Példa utca 123.</p>
                  <p><strong>Email:</strong> adatvedelem@allatmenhely.hu</p>
                  <p><strong>Telefon:</strong> +36 1 234 5678</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-blue-600" />
                2. Kezelt személyes adatok köre
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2">
                <li>Sed ut perspiciatis unde omnis iste natus error sit voluptatem</li>
                <li>Accusantium doloremque laudantium, totam rem aperiam</li>
                <li>Eaque ipsa quae ab illo inventore veritatis et quasi</li>
                <li>Architecto beatae vitae dicta sunt explicabo</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-purple-600" />
                3. Az adatkezelés célja és jogalapja
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit aut fugit, sed quia consequuntur magni dolores eos qui ratione voluptatem sequi nesciunt. Neque porro quisquam est, qui dolorem ipsum quia dolor sit amet.
              </p>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300 text-sm">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="border border-gray-300 p-3 text-left font-semibold">Adatkezelés célja</th>
                      <th className="border border-gray-300 p-3 text-left font-semibold">Jogalap</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-300 p-3">Regisztráció és azonosítás</td>
                      <td className="border border-gray-300 p-3">Szerződés teljesítése</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Szolgáltatás nyújtása</td>
                      <td className="border border-gray-300 p-3">Jogos érdek</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-300 p-3">Marketing kommunikáció</td>
                      <td className="border border-gray-300 p-3">Hozzájárulás</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-red-600" />
                4. Adatbiztonság és tárolás
              </CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Consectetur, adipisci velit, sed quia non numquam eius modi tempora incidunt ut labore et dolore magnam aliquam quaerat voluptatem. Ut enim ad minima veniam, quis nostrum exercitationem ullam corporis suscipit laboriosam.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 my-4">
                <h4 className="font-semibold text-red-900 mb-2">Biztonsági intézkedések:</h4>
                <ul className="list-disc list-inside text-red-800 space-y-1 text-sm">
                  <li>Nisi ut aliquid ex ea commodi consequatur</li>
                  <li>Quis autem vel eum iure reprehenderit</li>
                  <li>Qui in ea voluptate velit esse quam nihil</li>
                  <li>Molestiae consequatur vel illum qui dolorem</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Az érintett jogai</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Eum fugiat quo voluptas nulla pariatur? At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis praesentium voluptatum deleniti atque corrupti quos dolores et quas molestias excepturi sint occaecati.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Hozzáférési jog</h4>
                  <p className="text-blue-800 text-sm">Lorem ipsum dolor sit amet consectetur</p>
                </div>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-yellow-900 mb-2">Helyesbítési jog</h4>
                  <p className="text-yellow-800 text-sm">Adipiscing elit sed do eiusmod tempor</p>
                </div>
                <div className="bg-red-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-red-900 mb-2">Törlési jog</h4>
                  <p className="text-red-800 text-sm">Incididunt ut labore et dolore magna</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-green-900 mb-2">Tiltakozási jog</h4>
                  <p className="text-green-800 text-sm">Aliqua ut enim ad minim veniam quis</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Cookie-k használata</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Cupiditate non provident, similique sunt in culpa qui officia deserunt mollitia animi, id est laborum et dolorum fuga. Et harum quidem rerum facilis est et expedita distinctio.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Nam libero tempore, cum soluta nobis est eligendi optio cumque nihil impedit quo minus id quod maxime placeat facere possimus, omnis voluptas assumenda est.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Kapcsolatfelvétel és panaszkezelés</CardTitle>
            </CardHeader>
            <CardContent className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed mb-4">
                Omnis dolor repellendus. Temporibus autem quibusdam et aut officiis debitis aut rerum necessitatibus saepe eveniet ut et voluptates repudiandae sint et molestiae non recusandae.
              </p>
              <div className="bg-gray-50 rounded-lg p-6 text-center">
                <p className="text-gray-600 mb-4">
                  Adatvédelmi kérdéseivel forduljon hozzánk bizalommal:
                </p>
                <div className="text-gray-800 font-medium space-y-2">
                  <p>📧 adatvedelem@allatmenhely.hu</p>
                  <p>📞 +36 1 234 5678</p>
                  <p>📍 1051 Budapest, Példa utca 123.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}