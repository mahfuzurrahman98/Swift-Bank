export function PasswordFormatHelper() {
    return (
        <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>At least one lowercase and one uppercase letter</li>
            <li>
                At least one digit (0 to 9) and one special character (!@#$%)
            </li>
            <li>Between 8 and 20 characters</li>
        </ul>
    );
}
