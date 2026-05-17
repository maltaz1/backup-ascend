import React, { useState } from "react";
import { useStore } from "@/hooks/useStore";
import { updateDietSettings } from "@/lib/store";
import { showToast } from "@/components/ui/FlowToast";
import { supabase } from "@/lib/supabase";

export default function Settings() {
  const data = useStore();
  const [dietSettings, setDietSettings] = useState(data.diet.settings);

  const handleSaveDietSettings = () => {
    updateDietSettings(dietSettings);
    showToast("Metas de dieta atualizadas!", "success", "✅");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            ⚙️ Configurações
          </h1>
          <p className="text-muted-foreground">
            Personalize sua experiência no FlowZone
          </p>
        </div>

        {/* Settings Card */}
        <div className="fz-card p-6 space-y-6">
          {/* Diet Settings Section */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">
              🍎 Configurações de Dieta
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Meta Calórica Diária (kcal)
                </label>
                <input
                  type="number"
                  value={dietSettings.dailyCalorieGoal}
                  onChange={e =>
                    setDietSettings({
                      ...dietSettings,
                      dailyCalorieGoal: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Proteína (g)
                  </label>
                  <input
                    type="number"
                    value={dietSettings.proteinGoal}
                    onChange={e =>
                      setDietSettings({
                        ...dietSettings,
                        proteinGoal: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-green-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Carboidratos (g)
                  </label>
                  <input
                    type="number"
                    value={dietSettings.carbsGoal}
                    onChange={e =>
                      setDietSettings({
                        ...dietSettings,
                        carbsGoal: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-sm text-muted-foreground block mb-2">
                    Gordura (g)
                  </label>
                  <input
                    type="number"
                    value={dietSettings.fatGoal}
                    onChange={e =>
                      setDietSettings({
                        ...dietSettings,
                        fatGoal: parseInt(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-muted-foreground block mb-2">
                  Meta de Água (litros/dia)
                </label>
                <input
                  type="number"
                  step="0.5"
                  value={dietSettings.waterGoal}
                  onChange={e =>
                    setDietSettings({
                      ...dietSettings,
                      waterGoal: parseFloat(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                onClick={handleSaveDietSettings}
                className="w-full px-4 py-2 bg-amber-500 text-black rounded-lg font-medium hover:bg-amber-600 transition-colors"
              >
                💾 Salvar Configurações de Dieta
              </button>
            </div>
          </div>

          {/* About Section */}
          <div className="pt-6 border-t border-border">
            <h3 className="font-semibold text-foreground mb-4">Sobre</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex justify-between">
                <span>Versão</span>
                <span className="font-medium text-foreground">1.0.0</span>
              </div>
              <div className="flex justify-between">
                <span>Desenvolvido por</span>
                <span className="font-medium text-foreground">
                  FlowZone Team
                </span>
              </div>
              <div className="flex justify-between">
                <span>Última atualização</span>
                <span className="font-medium text-foreground">
                  26 de abril de 2026
                </span>
              </div>
            </div>
          </div>

          {/* Data Management */}

          <button
            onClick={async () => {
              await supabase.auth.signOut();
              window.location.reload();
            }}
            className="w-full px-4 py-2 bg-zinc-800 text-white rounded-lg font-medium hover:bg-zinc-700 transition-colors"
          >
            🚪 Sair da Conta
          </button>
          <div className="border-t border-border pt-6">
            <h3 className="font-semibold text-foreground mb-4">
              Gerenciamento de Dados
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => {
                  const data = localStorage.getItem("flowzone-data");
                  if (data) {
                    const blob = new Blob([data], { type: "application/json" });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `flowzone-backup-${new Date().toISOString().split("T")[0]}.json`;
                    a.click();
                    URL.revokeObjectURL(url);
                  }
                }}
                className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-blue-600 transition-colors"
              >
                📥 Fazer Backup dos Dados
              </button>

              <button
                onClick={() => {
                  if (
                    confirm(
                      "Tem certeza? Isso vai deletar todos os seus dados do FlowZone."
                    )
                  ) {
                    localStorage.removeItem("flowzone-data");
                    window.location.reload();
                  }
                }}
                className="w-full px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600 transition-colors"
              >
                🗑️ Limpar Todos os Dados
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>FlowZone © 2026 • Produtividade Pessoal Premium</p>
        </div>
      </div>
    </div>
  );
}
