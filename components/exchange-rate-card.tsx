import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExchangeRate } from "@/types";
import { formatCurrency } from "@/lib/utils";

interface ExchangeRateCardProps {
  rates: ExchangeRate[];
  className?: string;
}

export function ExchangeRateCard({ rates, className }: ExchangeRateCardProps) {
  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="text-xl">Today's Exchange Rates</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-2">
          {rates.map((rate) => (
            <div 
              key={rate._key} 
              className="flex justify-between items-center py-2 border-b border-gray-100 dark:border-gray-800 last:border-0"
            >
              <div className="flex items-center">
                <span className="font-medium">1 {rate.sourceCurrency}</span>
                <span className="mx-2 text-gray-400">=</span>
              </div>
              <div className="flex items-center">
                <span className="font-medium">{rate.rate.toFixed(4)}</span>
                <span className="ml-1 text-gray-600 dark:text-gray-400">
                  {rate.targetCurrency}
                </span>
              </div>
            </div>
          ))}
        </div>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
          Rates updated {new Date().toLocaleString()} • For informational purposes only
        </p>
      </CardContent>
    </Card>
  );
}