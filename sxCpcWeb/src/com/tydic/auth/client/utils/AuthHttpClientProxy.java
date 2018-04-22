package com.tydic.auth.client.utils;

import org.slf4j.LoggerFactory;

import com.tydic.auth.crm.spec.domain.Request;
import com.tydic.auth.crm.spec.domain.Response;
import com.tydic.auth.framework.web.proxy.AbstractProxy;
import com.tydic.auth.framework.web.proxy.IServiceProviderProxy;
import com.tydic.auth.framework.web.rest.InvokeException;

import com.tydic.framework.web.rest.Restful;

/*
  IServiceProviderProxy 属于auth-client
  Restful  属于fw-web
 */
public class AuthHttpClientProxy extends AbstractProxy implements
		IServiceProviderProxy {
	private final static org.slf4j.Logger logger = LoggerFactory
			.getLogger(AuthHttpClientProxy.class);
	Restful restful;

	public Restful getRestful() {
		return restful;
	}

	public void setRestful(Restful restful) {
		this.restful = restful;
	}

	public void destroy() {

	}

	public Response invoke(String url, Request request) {
		initRequest(request);
		request.setServiceCode(url);
		String value = request.toJSONString();// buildRequest(request);

		try {
			if (logger.isDebugEnabled())
				logger.debug(value);
			String json = restful.post(url, value);
			if (logger.isDebugEnabled())
				logger.debug(json);
			Response response = Response.parse4Json(filterResponseJson(json),
					null);
			return response;
		} catch (Throwable t) {
			logger.error(t.getMessage());
			throw new InvokeException(t);
		}
	}

	public void init() {

	}
}
