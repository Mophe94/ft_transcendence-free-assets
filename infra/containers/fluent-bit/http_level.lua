function map_level(tag, timestamp, record)

    local status = record["status"]

    if status == nil then
	return 1, timestamp, record
    end

    status = tonumber(status)

    if status >= 500 then
	record["level"] = "error"
    elseif status >= 400 then
	record["level"] = "warn"
    else
	record["level"] = "info"
    end

    return 1, timestamp, record
end
