<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use UnexpectedValueException;

class SanitizeInput
{
    public function handle(Request $request, Closure $next): Response
    {
        $input = $request->isJson()
            ? $request->json()
            : ($request->isMethod('GET') ? $request->query : $request->request);

        $input->replace($this->sanitize($input->all()));
        $request->query->replace($this->sanitize($request->query->all()));

        return $next($request);
    }

    /**
     * @param  array<string|int, mixed>  $data
     * @return array<string|int, mixed>
     */
    private function sanitize(array $data): array
    {
        foreach ($data as $key => $value) {
            if (is_array($value)) {
                $data[$key] = $this->sanitize($value);
            } elseif (is_string($value) && ! $this->isSensitiveField((string) $key)) {
                $data[$key] = $this->sanitizeString($value);
            }
        }

        return $data;
    }

    private function isSensitiveField(string $key): bool
    {
        return preg_match('/(^|_)(password|token|secret)(_|$)/i', $key) === 1;
    }

    private function sanitizeString(string $value): string
    {
        $sanitized = preg_replace('/\s+/u', ' ', strip_tags($value));

        if ($sanitized === null) {
            throw new UnexpectedValueException('Unable to normalize invalid UTF-8 request input.');
        }

        return trim($sanitized);
    }
}
