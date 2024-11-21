import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Description = ({ customerDescription, iaDescription }) => {
  return (
    <div className="space-y-6">
      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">Customer Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {customerDescription || 'Not available'}
          </p>
        </CardContent>
      </Card>

      <Card className="bg-card">
        <CardHeader>
          <CardTitle className="text-lg">AI Description</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {iaDescription || 'Not available'}
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Description;