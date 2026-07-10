<?php

namespace App\Traits;

use OpenSpout\Common\Entity\Style\Style;
use Rap2hpoutre\FastExcel\FastExcel;

trait HasAdvancedActions
{
    public function export()
    {
        $this->checkAuthorize(__FUNCTION__);

        $headerStyle = (new Style())->setFontBold();

        $fileName = request()->getHost() . '_' . $this->getTable() . "_" . date('Y_m_d');

        return (new FastExcel($this->exportResourcesGenerator()))
            ->headerStyle($headerStyle)
            ->download("$fileName.xlsx");
    }

    function exportResourcesGenerator()
    {
        foreach ($this->model::cursor() as $item) {
            yield $item;
        }
    }
}
