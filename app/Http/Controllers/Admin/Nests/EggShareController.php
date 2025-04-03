<?php

namespace PhoenixPanel\Http\Controllers\Admin\Nests;

use PhoenixPanel\Models\Egg;
use Illuminate\Http\RedirectResponse;
use Prologue\Alerts\AlertsMessageBag;
use PhoenixPanel\Http\Controllers\Controller;
use Symfony\Component\HttpFoundation\Response;
use PhoenixPanel\Services\Eggs\Sharing\EggExporterService;
use PhoenixPanel\Services\Eggs\Sharing\EggImporterService;
use PhoenixPanel\Http\Requests\Admin\Egg\EggImportFormRequest;
use PhoenixPanel\Services\Eggs\Sharing\EggUpdateImporterService;

class EggShareController extends Controller
{
    /**
     * EggShareController constructor.
     */
    public function __construct(
        protected AlertsMessageBag $alert,
        protected EggExporterService $exporterService,
        protected EggImporterService $importerService,
        protected EggUpdateImporterService $updateImporterService
    ) {
    }

    /**
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     */
    public function export(Egg $egg): Response
    {
        $filename = trim(preg_replace('/\W/', '-', kebab_case($egg->name)), '-');

        return response($this->exporterService->handle($egg->id), 200, [
            'Content-Transfer-Encoding' => 'binary',
            'Content-Description' => 'File Transfer',
            'Content-Disposition' => 'attachment; filename=egg-' . $filename . '.json',
            'Content-Type' => 'application/json',
        ]);
    }

    /**
     * Import a new service option using an XML file.
     *
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     * @throws \PhoenixPanel\Exceptions\Service\Egg\BadJsonFormatException
     * @throws \PhoenixPanel\Exceptions\Service\InvalidFileUploadException
     */
    public function import(EggImportFormRequest $request): RedirectResponse
    {
        $egg = $this->importerService->handle($request->file('import_file'), $request->input('import_to_nest'));
        $this->alert->success(trans('admin/nests.eggs.notices.imported'))->flash();

        return redirect()->route('admin.nests.egg.view', ['egg' => $egg->id]);
    }

    /**
     * Update an existing Egg using a new imported file.
     *
     * @throws \PhoenixPanel\Exceptions\Model\DataValidationException
     * @throws \PhoenixPanel\Exceptions\Repository\RecordNotFoundException
     * @throws \PhoenixPanel\Exceptions\Service\Egg\BadJsonFormatException
     * @throws \PhoenixPanel\Exceptions\Service\InvalidFileUploadException
     */
    public function update(EggImportFormRequest $request, Egg $egg): RedirectResponse
    {
        $this->updateImporterService->handle($egg, $request->file('import_file'));
        $this->alert->success(trans('admin/nests.eggs.notices.updated_via_import'))->flash();

        return redirect()->route('admin.nests.egg.view', ['egg' => $egg]);
    }
}


